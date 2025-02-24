from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import os
from datetime import datetime, timedelta
from .serializer import PredictionRequestSerializer

class LstmPredictionView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def __init__(self):
        super().__init__()

        # Load the model from the disk
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'dengue_lstm_model.h5')
        self.model = tf.keras.models.load_model(model_path)
        
        # Initialize scalers
        self.feature_scaler = MinMaxScaler()
        self.target_scaler = MinMaxScaler()
        
        # Define feature ranges based on your training data
        # Todo: Update with actual feature ranges
        # Params: (max, min)
        self.feature_ranges = {
            'Rainfall': (0, 100),  
            'MaxTemperature': (20, 40),
            'Humidity': (0, 100),
            'Cases': (0, 1000)  
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
    def predict_next_n_weeks(self, initial_sequence, future_weather, n_weeks=8):
        predictions = []
        current_sequence = initial_sequence.copy()
        
        # Loop through each week and predict
        for week in range(n_weeks):
            batch_size = 1
            num_features = 4
            model_input = current_sequence.reshape(batch_size, self.window_size, num_features)
            prediction = self.model.predict(model_input, verbose=0)
            
            # Denormalize the predicted cases value
            denormalized_prediction = self.denormalize_value(prediction[0][0], 'Cases')
            
            # Get weather data for the next week
            if week < len(future_weather):
                next_weather = future_weather[week]
            else:
                # If no weather data provided, use the last known weather
                next_weather = future_weather[-1]
            
            # Create new data point with predicted cases and next week's weather
            new_data_point = np.array([
                self.normalize_value(next_weather['rainfall'], 'Rainfall'),
                self.normalize_value(next_weather['max_temperature'], 'MaxTemperature'),
                self.normalize_value(next_weather['humidity'], 'Humidity'),
                prediction[0][0]  # Already normalized
            ])
            
            # Update sequence for the next prediction
            current_sequence = np.vstack([current_sequence[1:], new_data_point])
            
            # Store the prediction with a confidence interval
            predictions.append({
                'week': week + 1,
                'predicted_cases': round(float(denormalized_prediction), 2),
                'confidence_interval': {
                    'lower': round(float(denormalized_prediction * 0.9), 2),
                    'upper': round(float(denormalized_prediction * 1.1), 2)
                }
            })
        
        return predictions

    def post(self, request):
        try:
            # Use the PredictionRequestSerializer to validate the input data
            serializer = PredictionRequestSerializer(data=request.data)
            
            # Check if the data is valid
            if serializer.is_valid():
                # Extract the data from the validated serializer
                historical_data = serializer.validated_data['historical_data']
                future_weather = serializer.validated_data['future_weather']
                last_date = serializer.validated_data['last_date']
                
                # Validate the length of historical data
                if len(historical_data) < self.window_size:
                    return Response(
                        {"error": f"Insufficient historical data. Need at least {self.window_size} weeks of data."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Prepare the initial sequence for the model (using the most recent data)
                initial_sequence = np.array([
                    [
                        self.normalize_value(data['rainfall'], 'Rainfall'),
                        self.normalize_value(data['max_temperature'], 'MaxTemperature'),
                        self.normalize_value(data['humidity'], 'Humidity'),
                        self.normalize_value(data['cases'], 'Cases')
                    ]
                    for data in historical_data[-self.window_size:]
                ])
                
                # Get predictions for the next 8 weeks
                predictions = self.predict_next_n_weeks(
                    initial_sequence,
                    future_weather,
                    n_weeks=8
                )
                
                # Calculate prediction dates
                for i, pred in enumerate(predictions):
                    pred['date'] = (last_date + timedelta(weeks=i+1)).strftime('%Y-%m-%d')
                
                # Return the predictions and metadata in the response
                return Response({
                    "predictions": predictions,
                    "metadata": {
                        "model_window_size": self.window_size,
                        "prediction_generated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    }
                })
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
