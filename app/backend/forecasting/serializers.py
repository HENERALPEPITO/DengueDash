from rest_framework import serializers


class WeatherDataSerializer(serializers.Serializer):
    rainfall = serializers.FloatField()
    max_temperature = serializers.FloatField()
    humidity = serializers.FloatField()


class PredictionRequestSerializer(serializers.Serializer):
    future_weather = WeatherDataSerializer(many=True)
