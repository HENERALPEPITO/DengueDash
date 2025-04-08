from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np
import os
import math
import pandas as pd
from datetime import datetime, timedelta
from .serializers import (
    PredictionRequestSerializer,
    ModelTrainingSerializer,
)
from case.models import Case
from case.views.case_report_view import fetch_cases_for_week
from weather.models import Weather
import shutil
import json
from django.http import JsonResponse


class LstmTrainingView(APIView):
    permission_classes = (permissions.AllowAny,)

    def __init__(self):
        super().__init__()
        self.model_dir = os.path.join(os.path.dirname(__file__), "ml-dl-models")
        self.model_path = os.path.join(self.model_dir, "dengue_lstm_model.h5")
        self.metadata_path = os.path.join(self.model_dir, "model_metadata.json")

        # Ensure directory exists
        os.makedirs(self.model_dir, exist_ok=True)

        # Metdadata
        self.dataset_length = 0

        self.scaler_features = MinMaxScaler()
        self.scaler_target = MinMaxScaler()

        self.normalized_data = None
        self.normalized_target = None
        self.results = {}

    def get_features_target(self):
        # todo: base the end_date to the last date_con in cases
        weather_records = Weather.objects.all().order_by("start_day")

        features_dataset = []
        target_dataset = []

        for weather in weather_records:
            cases_for_week = fetch_cases_for_week(weather.start_day)

            features_dataset.append(
                [
                    weather.weekly_rainfall,
                    weather.weekly_temperature,
                    weather.weekly_humidity,
                ]
            )

            target_dataset.append(cases_for_week)

        # For Metdata
        self.dataset_length = len(features_dataset)

        return np.array(features_dataset), np.array(target_dataset)

    def normalize_data(self):
        features, target = self.get_features_target()

        normalized_features = self.scaler_features.fit_transform(features)
        self.normalized_target = self.scaler_target.fit_transform(target.reshape(-1, 1))

        self.normalized_data = pd.DataFrame(
            normalized_features,
            columns=["Rainfall", "Temperature", "Humidity"],
        )
        self.normalized_data["Cases"] = self.normalized_target

    def create_sequences(
        self,
        data,
        target,
        window_size,
    ):
        X, y = [], []
        for i in range(window_size, len(data)):
            X.append(data[i - window_size : i])
            y.append(target[i])
        return np.array(X), np.array(y)

    def train_model_with_validation(
        self,
        window_size=5,
        validation_split=0.2,
    ):
        # Fetch and normalize data
        self.normalize_data()

        X, y = self.create_sequences(
            self.normalized_data.values,
            self.normalized_target,
            window_size,
        )

        split_index = int(len(X) * (1 - validation_split))
        X_train, X_test = X[:split_index], X[split_index:]
        y_train, y_test = y[:split_index], y[split_index:]

        model = Sequential()
        # Input Layer
        model.add(Input(shape=(X_train.shape[1], X_train.shape[2])))
        model.add(LSTM(64, activation="relu"))
        # Output Layer
        model.add(Dense(1))

        # Compile the model with Adam optimizer and custom learning rate

        learning_rate = 0.001
        optimizer = Adam(learning_rate=learning_rate)
        model.compile(optimizer=optimizer, loss="mean_squared_error")

        # Early stopping callback
        early_stopping = EarlyStopping(
            monitor="val_loss", patience=5, restore_best_weights=True
        )

        # Train the model
        history = model.fit(
            X_train,
            y_train,
            epochs=100,
            batch_size=1,
            validation_data=(X_test, y_test),
            verbose=1,
            callbacks=[early_stopping],
        )

        # Predict on test set
        y_pred = model.predict(X_test)

        # Rescale back to original dengue case values
        predicted_actual_scale = self.scaler_target.inverse_transform(y_pred)
        y_test_actual_scale = self.scaler_target.inverse_transform(y_test)

        # Compute MSE and RMSE
        mse = mean_squared_error(
            y_test_actual_scale,
            predicted_actual_scale,
        )
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(
            y_test_actual_scale,
            predicted_actual_scale,
        )
        r2 = r2_score(
            y_test_actual_scale,
            predicted_actual_scale,
        )

        # Create metadata
        metadata = {
            "window_size": window_size,
            "last_trained": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "dataset_size": self.dataset_length,
            "metrics": {
                "mse": float(mse),
                "rmse": float(rmse),
                "mae": float(mae),
                "r2": float(r2),
            },
            "epochs_completed": len(history.history["loss"]),
        }

        temp_model_path, temp_metadata_path = self.save_temp_model_metadata(
            model, metadata
        )

        return {
            "success": True,
            "metrics": metadata["metrics"],
            "dataset_size": metadata["dataset_size"],
            "window_size": metadata["window_size"],
            "epochs_completed": metadata["epochs_completed"],
            "temp_model_path": temp_model_path,
            "temp_metadata_path": temp_metadata_path,
        }

    def save_temp_model_metadata(
        self,
        model,
        metadata,
    ):
        # Save model and metadata to temporary location
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_model_path = os.path.join(self.model_dir, f"temp_model_{timestamp}.h5")
        temp_metadata_path = os.path.join(
            self.model_dir, f"temp_metadata_{timestamp}.json"
        )
        model.save(temp_model_path)

        with open(temp_metadata_path, "w") as f:
            json.dump(metadata, f)

        return temp_model_path, temp_metadata_path

    def backup_existing_model(self):
        """Create a backup of the existing model if it exists"""
        backup_info = {"model_backed_up": False}

        if os.path.exists(self.model_path):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_model_path = os.path.join(
                self.model_dir, f"dengue_lstm_model_backup_{timestamp}.h5"
            )
            backup_metadata_path = os.path.join(
                self.model_dir, f"model_metadata_backup_{timestamp}.json"
            )

            # Copy model and metadata to backup
            shutil.copy2(self.model_path, backup_model_path)

            if os.path.exists(self.metadata_path):
                shutil.copy2(self.metadata_path, backup_metadata_path)

            backup_info = {
                "model_backed_up": True,
                "backup_model_path": backup_model_path,
                "backup_metadata_path": backup_metadata_path,
            }

        return backup_info

    def commit_model(self, temp_model_path, temp_metadata_path):
        """Commit the temporary model to become the main model"""
        # Move temporary model to the main model path
        shutil.copy2(temp_model_path, self.model_path)
        shutil.copy2(temp_metadata_path, self.metadata_path)

        # Clean up temporary files
        os.remove(temp_model_path)
        os.remove(temp_metadata_path)

        return True

    def post(self, request):
        try:
            serialier = ModelTrainingSerializer(data=request.data)

            if not serialier.is_valid():
                return JsonResponse(
                    {
                        "success": False,
                        "message": serialier.errors,
                    }
                )

            window_size = serialier.validated_data.get("window_size", 5)
            validation_split = serialier.validated_data.get("validation_split", 0.2)

            # Only backup existing model if needed
            backup_info = self.backup_existing_model()

            # Train new model and save to temporary location
            training_result = self.train_model_with_validation(
                window_size,
                validation_split,
            )

            if not training_result["success"]:
                return JsonResponse(
                    {
                        "success": False,
                        "message": "Model training failed.",
                    }
                )

            metrics = training_result["metrics"]

            existing_model_metrics = None
            if os.path.exists(self.metadata_path):
                with open(self.metadata_path, "r") as f:
                    existing_metadata = json.load(f)
                    existing_model_metrics = existing_metadata.get("metrics", {})

            # Make decision to commit model based on metrics
            # For example, only commit if the new model has better R² or lower RMSE
            should_commit = True
            commit_reason = "New model trained successfully"

            if existing_model_metrics:
                # Example: Only commit if R² is better or same but RMSE is lower
                if metrics["r2"] >= existing_model_metrics["r2"] or (
                    metrics["r2"]
                    >= existing_model_metrics["r2"] * 0.95  # Within 5% of previous R²
                    and metrics["rmse"] < existing_model_metrics["rmse"]
                ):
                    commit_reason = (
                        "New model has better or comparable performance metrics"
                    )
                else:
                    should_commit = False
                    commit_reason = "New model metrics are worse than existing model"

            response_data = {
                "training_completed": True,
                "metrics": metrics,
                "dataset_size": training_result["dataset_size"],
                "window_size": training_result["window_size"],
                "epochs_completed": training_result["epochs_completed"],
                "model_committed": should_commit,
                "commit_reason": commit_reason,
                "backup_info": backup_info if backup_info["model_backed_up"] else None,
            }

            # Only commit if decided to do so
            if should_commit:
                self.commit_model(
                    training_result["temp_model_path"],
                    training_result["temp_metadata_path"],
                )
            else:
                # Clean up temporary files without committing
                os.remove(training_result["temp_model_path"])
                os.remove(training_result["temp_metadata_path"])

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse(
                {
                    "success": False,
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LstmPredictionView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def __init__(self):
        super().__init__()

        # Load the model from the disk
        model_path = os.path.join(
            os.path.dirname(__file__), "ml-dl-models", "dengue_lstm_model.h5"
        )
        self.model = tf.keras.models.load_model(model_path)

        # Initialize scalers
        self.feature_scaler = MinMaxScaler()
        self.target_scaler = MinMaxScaler()

        # Define feature ranges based on your training data
        # Todo: Update with actual feature ranges
        # Params: (max, min)
        self.feature_ranges = {
            "Rainfall": (0, 100),
            "MaxTemperature": (20, 40),
            "Humidity": (0, 100),
            "Cases": (0, 1000),
        }

        self.window_size = 5  # Number of weeks to look back for predictions

    # Normalizes the feature value based on the min-max range
    def normalize_value(self, value, feature):
        min_val, max_val = self.feature_ranges[feature]
        return (value - min_val) / (max_val - min_val)

    # Denormalizes the feature value based on the min-max range
    def denormalize_value(self, normalized_value, feature):
        min_val, max_val = self.feature_ranges[feature]
        return normalized_value * (max_val - min_val) + min_val

    def get_latest_week_number(self):
        cases = Case.objects.latest("date_con").date_con
        return cases.isocalendar().week

    # Generates predictions for the next n weeks using the model
    def predict_next_n_weeks(
        self,
        initial_sequence,
        future_weather,
        n_weeks=5,
    ):
        predictions = []
        current_sequence = initial_sequence.copy()
        current_week_number = self.get_latest_week_number()

        # Loop through each week and predict
        for week in range(n_weeks):
            batch_size = 1
            num_features = 4
            model_input = current_sequence.reshape(
                batch_size, self.window_size, num_features
            )
            prediction = self.model.predict(model_input, verbose=0)

            # Denormalize the predicted cases value
            denormalized_prediction = self.denormalize_value(prediction[0][0], "Cases")

            # Get weather data for the next week
            if week < len(future_weather):
                next_weather = future_weather[week]
            else:
                # If no weather data provided, use the last known weather
                next_weather = future_weather[-1]

            # Create new data point with predicted cases and next week's weather
            new_data_point = np.array(
                [
                    self.normalize_value(next_weather["rainfall"], "Rainfall"),
                    self.normalize_value(
                        next_weather["max_temperature"], "MaxTemperature"
                    ),
                    self.normalize_value(next_weather["humidity"], "Humidity"),
                    prediction[0][0],  # Already normalized
                ]
            )

            # Update sequence for the next prediction
            current_sequence = np.vstack([current_sequence[1:], new_data_point])

            # Store the prediction with a confidence interval
            predictions.append(
                {
                    "week": current_week_number + week + 1,
                    "predicted_cases": math.ceil(float(denormalized_prediction)),
                    "confidence_interval": {
                        "lower": math.ceil(float(denormalized_prediction * 0.9)),
                        "upper": math.ceil(float(denormalized_prediction * 1.1)),
                    },
                }
            )

        return predictions

    def post(self, request):
        try:
            # Use the PredictionRequestSerializer to validate the input data
            serializer = PredictionRequestSerializer(data=request.data)

            # Check if the data is valid
            if serializer.is_valid():
                weather_last_five_weeks = Weather.objects.all().order_by("-start_day")[
                    :5
                ]

                # Error checking inside the database
                # Todo: Create a better implementation than this one
                # One scenario is that the weather table has no value
                # or less than the required last 5 weeks
                if len(weather_last_five_weeks) < 5:
                    return Response(
                        {
                            "error": "Insufficient historical weather data. Need at least 5 weeks of data. Please run the seeder"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                weather_last_five_weeks = list(reversed(weather_last_five_weeks))

                historical_data = []
                for weather in weather_last_five_weeks:
                    cases_for_week = fetch_cases_for_week(weather.start_day)

                    historical_data.append(
                        {
                            "rainfall": weather.weekly_rainfall,
                            "humidity": weather.weekly_humidity,
                            "max_temperature": weather.weekly_temperature,
                            "cases": cases_for_week,
                        }
                    )

                future_weather = serializer.validated_data["future_weather"]

                initial_sequence = np.array(
                    [
                        [
                            self.normalize_value(data["rainfall"], "Rainfall"),
                            self.normalize_value(
                                data["max_temperature"], "MaxTemperature"
                            ),
                            self.normalize_value(data["humidity"], "Humidity"),
                            self.normalize_value(data["cases"], "Cases"),
                        ]
                        for data in historical_data[-self.window_size :]
                    ]
                )

                # Get predictions for the next 8 weeks
                predictions = self.predict_next_n_weeks(
                    initial_sequence,
                    future_weather,
                    # Using the current plan for weatheropenai,
                    # the maximum forecasted weather data is 16 days
                    # However, the optimized version is to use
                    # the window size of 5 weeks
                    n_weeks=2,
                    # n_weeks=self.window_size,
                )

                # Calculate prediction dates
                for i, pred in enumerate(predictions):
                    # Todo: Do not solely rely on the last weather data
                    pred["date"] = (
                        weather_last_five_weeks[-1].start_day + timedelta(weeks=i + 1)
                    ).strftime("%Y-%m-%d")

                # Return the predictions and metadata in the response
                return Response(
                    {
                        "predictions": predictions,
                        "metadata": {
                            "model_window_size": self.window_size,
                            "prediction_generated_at": datetime.now().strftime(
                                "%Y-%m-%d-%H-%M-%S"
                            ),
                        },
                    }
                )
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
