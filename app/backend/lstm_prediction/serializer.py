from rest_framework import serializers

class LstmPredictionSerializer(serializers.Serializer):
    predicted_cases_next_8_weeks = serializers.ListField(
        child = serializers.IntegerField()
    )