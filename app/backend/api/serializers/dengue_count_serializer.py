from rest_framework import serializers


class MapDengueCountSerializer(serializers.Serializer):
    barangay = serializers.CharField()
    case_count = serializers.IntegerField()
    death_count = serializers.IntegerField()


class YearlyDengueCountSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    case_count = serializers.IntegerField()
    death_count = serializers.IntegerField()
