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

# Test
import csv


class LstmTrainingView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def __init__(self):
        super().__init__()
        self.model_dir = os.path.join(os.path.dirname(__file__), "ml-dl-models")
        self.model_path = os.path.join(self.model_dir, "dengue_lstm_model.h5")
        self.metadata_path = os.path.join(self.model_dir, "model_metadata.json")

        # Feature ranges
        self.feature_ranges = {
            "Rainfall": (0, 100),
            "MaxTemperature": (20, 40),
            "Humidity": (0, 100),
            "Cases": (0, 1000),
        }

        # Ensure directory exists
        os.makedirs(self.model_dir, exist_ok=True)

    def normalize_value(self, value, feature):
        """Normalize a value using the feature's min-max range"""
        min_val, max_val = self.feature_ranges[feature]
        return (value - min_val) / (max_val - min_val)

    def create_sequences(self, data, window_size):
        """Create sequences for LSTM training"""
        X, y = [], []
        for i in range(window_size, len(data)):
            X.append(data[i - window_size : i])
            y.append(data[i][3])  # Cases is at index 3
        return np.array(X), np.array(y)

    def fetch_training_data(self):
        """Fetch case and weather data from the database"""
        # Get all weather records ordered by date
        weather_records = Weather.objects.all().order_by("start_day")

        # Prepare dataset
        dataset = []

        # Debugging Purposes:
        filename = "output.csv"
        data = [["Rainfall", "MaxTemperature", "Humidity", "Cases"]]

        for weather in weather_records:
            # Get cases for this week
            cases_for_week = fetch_cases_for_week(weather.start_day)

            # Debugging Purposes:
            data.append(
                [
                    weather.weekly_rainfall,
                    weather.weekly_temperature,
                    weather.weekly_humidity,
                    cases_for_week,
                ]
            )

            # Add normalized data point
            dataset.append(
                [
                    self.normalize_value(weather.weekly_rainfall, "Rainfall"),
                    self.normalize_value(weather.weekly_temperature, "MaxTemperature"),
                    self.normalize_value(weather.weekly_humidity, "Humidity"),
                    self.normalize_value(cases_for_week, "Cases"),
                ]
            )

        # Debugging Purposes:
        with open(filename, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerows(data)
        print(f"Data written to {filename}")

        return np.array(dataset)

    def get_cases_for_week(self, week_start_date):
        """Get total cases for a specific week"""
        week_end_date = week_start_date + timedelta(days=6)
        cases = Case.objects.filter(
            date_con__gte=week_start_date, date_con__lte=week_end_date
        ).count()
        return cases

    def train_model_with_validation(self, window_size=5, validation_split=0.2):
        """Train the LSTM model with current data and save to a temporary location"""
        # Generate a temporary file path for the new model
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_model_path = os.path.join(self.model_dir, f"temp_model_{timestamp}.h5")
        temp_metadata_path = os.path.join(
            self.model_dir, f"temp_metadata_{timestamp}.json"
        )

        # Fetch and prepare data
        dataset = self.fetch_training_data()

        if len(dataset) < window_size + 10:  # Need enough data for training
            return {
                "success": False,
                "error": f"Insufficient data for training. Need at least {window_size + 10} weeks of data.",
            }

        # Create sequences
        X, y = self.create_sequences(dataset, window_size)

        # Split into training and validation sets
        split_idx = int(len(X) * (1 - validation_split))
        X_train, X_val = X[:split_idx], X[split_idx:]
        y_train, y_val = y[:split_idx], y[split_idx:]

        # Define model architecture
        model = Sequential()
        model.add(Input(shape=(window_size, 4)))  # 4 features
        model.add(LSTM(64, activation="relu"))
        model.add(Dense(1))

        # Compile model
        optimizer = Adam(learning_rate=0.001)
        model.compile(optimizer=optimizer, loss="mean_squared_error")

        # Early stopping
        early_stopping = EarlyStopping(
            monitor="val_loss", patience=5, restore_best_weights=True
        )

        # Train model
        history = model.fit(
            X_train,
            y_train,
            epochs=100,
            batch_size=1,
            validation_data=(X_val, y_val),
            callbacks=[early_stopping],
            verbose=1,
        )

        # Evaluate model
        y_pred = model.predict(X_val)

        # Denormalize for metrics calculation
        min_val, max_val = self.feature_ranges["Cases"]
        y_val_denorm = y_val * (max_val - min_val) + min_val
        y_pred_denorm = y_pred * (max_val - min_val) + min_val

        # Calculate metrics
        mse = mean_squared_error(y_val_denorm, y_pred_denorm)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_val_denorm, y_pred_denorm)
        r2 = r2_score(y_val_denorm, y_pred_denorm)

        # Create metadata
        metadata = {
            "window_size": window_size,
            "last_trained": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "dataset_size": len(dataset),
            "metrics": {
                "mse": float(mse),
                "rmse": float(rmse),
                "mae": float(mae),
                "r2": float(r2),
            },
            "feature_ranges": self.feature_ranges,
            "epochs_completed": len(history.history["loss"]),
        }

        # Save model to temporary location first
        model.save(temp_model_path)

        # Save metadata to temporary location
        with open(temp_metadata_path, "w") as f:
            json.dump(metadata, f)

        return {
            "success": True,
            "metrics": metadata["metrics"],
            "dataset_size": metadata["dataset_size"],
            "window_size": metadata["window_size"],
            "epochs_completed": metadata["epochs_completed"],
            "temp_model_path": temp_model_path,
            "temp_metadata_path": temp_metadata_path,
        }

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
        """API endpoint for training model"""
        try:
            serializer = ModelTrainingSerializer(data=request.data)

            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Get parameters from request
            window_size = serializer.validated_data.get("window_size", 5)
            validation_split = serializer.validated_data.get("validation_split", 0.2)

            # Only backup existing model if needed
            backup_info = self.backup_existing_model()

            # Train new model to temporary location
            training_result = self.train_model_with_validation(
                window_size, validation_split
            )

            if not training_result["success"]:
                return Response(
                    {
                        "error": training_result["error"],
                        "backup_info": (
                            backup_info if backup_info["model_backed_up"] else None
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get model quality metrics
            metrics = training_result["metrics"]

            # Get existing model metrics if available for comparison
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
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
