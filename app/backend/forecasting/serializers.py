from rest_framework import serializers


class WeatherDataSerializer(serializers.Serializer):
    rainfall = serializers.FloatField()
    max_temperature = serializers.FloatField()
    humidity = serializers.FloatField()


class PredictionRequestSerializer(serializers.Serializer):
    future_weather = WeatherDataSerializer(many=True)


class ModelTrainingSerializer(serializers.Serializer):
    window_size = serializers.IntegerField(
        required=False, default=5, min_value=1, max_value=20
    )
    validation_split = serializers.FloatField(
        required=False, default=0.2, min_value=0.1, max_value=0.5
    )
