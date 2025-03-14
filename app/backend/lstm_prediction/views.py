from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import os
import math
from datetime import datetime, timedelta
from .serializers import PredictionRequestSerializer
from case.views.case_report_view import fetch_cases_for_week
from weather.models import Weather


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

    # Generates predictions for the next n weeks using the model
    def predict_next_n_weeks(
        self,
        initial_sequence,
        future_weather,
        n_weeks=5,
    ):
        predictions = []
        current_sequence = initial_sequence.copy()

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
                    "week": week + 1,
                    # "predicted_cases": round(float(denormalized_prediction), 2),
                    # "confidence_interval": {
                    #     "lower": round(float(denormalized_prediction * 0.9), 2),
                    #     "upper": round(float(denormalized_prediction * 1.1), 2),
                    # },
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
                    initial_sequence, future_weather, n_weeks=self.window_size
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
                                "%Y-%m-%d %H:%M:%S"
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
