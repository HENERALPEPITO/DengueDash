# myapp/views.py

import os
import threading
import tensorflow as tf
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from lstm_prediction.serializer import LstmPredictionSerializer
from weather.models import Weather
from case.models import Case
from django.db.models import Count

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'models', 'dengue_lstm_model.keras')
model = tf.keras.models.load_model(model_path)

# Create a thread lock for safe multi-threaded predictions
model_lock = threading.Lock()

class LstmPredictionView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LstmPredictionSerializer

    @csrf_exempt
    def get(self, request):
        predictions = []

        # Fetch the last 20 weeks of weather data, ordered by start_day descending
        weather_data = Weather.objects.all().order_by('-start_day')

        # Use the earliest start_day from weather_data as the lower bound for case data
        earliest_weather_date = weather_data.last().start_day

        # Fetch the case data with aggregation, and add an ordering clause
        case_data = (
            Case.objects.filter(date_con__gte=earliest_weather_date)
            .values('date_con')
            .annotate(case_count=Count('case_id'))
            .order_by('date_con')  # <-- Added ordering here
        )

        # Prepare input_data for the LSTM model (expected shape: (1, 20, 4))
        input_data = []

        # Iterate through the weather data (which is in descending order)
        # You may want to reverse it to get chronological order
        for week in reversed(weather_data):
            # Attempt to find case count for the given week
            week_data = case_data.filter(date_con=week.start_day).first()
            week_case_count = week_data.get('case_count', 0) if week_data else 0

            # Append the data: [dengue_cases, temperature, humidity, rainfall]
            input_data.append([
                week_case_count,
                week.weekly_temperature,
                week.weekly_humidity,
                week.weekly_rainfall
            ])
            

        # Convert to NumPy array with shape (1, 20, 4)
        input_data = np.array([input_data])

        with model_lock:
            try:
                for _ in range(8):
                    # Predict the next week using the current input data
                    next_week_prediction = model.predict(input_data)
                    predictions.append(round(float(next_week_prediction[0, 0])))  # Assuming single output value for each week

                    # Update the input data for the next week prediction by adding the predicted value
                    new_input = np.roll(input_data, shift=-1, axis=1)
                    new_input[0, -1, 0] = next_week_prediction[0, 0]  # Update dengue cases feature
                    input_data = new_input
            except Exception as e:
                print(f"Error during model prediction: {str(e)}")
                return Response({"error": f"Prediction failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            # Serialize the predictions
            serializer = LstmPredictionSerializer(data={"predicted_cases_next_8_weeks": predictions})
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"error": "Failed to serialize data."}, status=status.HTTP_400_BAD_REQUEST)
