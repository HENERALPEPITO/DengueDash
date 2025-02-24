from rest_framework import serializers

class WeatherDataSerializer(serializers.Serializer):
    rainfall = serializers.FloatField()
    max_temperature = serializers.FloatField()
    humidity = serializers.FloatField()

class HistoricalDataSerializer(serializers.Serializer):
    rainfall = serializers.FloatField()
    max_temperature = serializers.FloatField()
    humidity = serializers.FloatField()
    cases = serializers.FloatField()

class PredictionRequestSerializer(serializers.Serializer):
    historical_data = HistoricalDataSerializer(many=True)
    future_weather = WeatherDataSerializer(many=True)
    last_date = serializers.DateField()
