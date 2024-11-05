from rest_framework import serializers


class CurrentDengueCountSerializer(serializers.Serializer):
    total_cases = serializers.IntegerField()
    total_deaths = serializers.IntegerField()
    weekly_cases = serializers.IntegerField()
    weekly_deaths = serializers.IntegerField()


class MapDengueCountSerializer(serializers.Serializer):
    barangay = serializers.CharField()
    case_count = serializers.IntegerField()
    death_count = serializers.IntegerField()


class YearlyDengueCountSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    case_count = serializers.IntegerField()
    death_count = serializers.IntegerField()
