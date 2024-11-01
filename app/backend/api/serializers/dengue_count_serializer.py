from rest_framework import serializers


class DengueCountSerializer(serializers.Serializer):
    barangay = serializers.CharField()
    case_count = serializers.IntegerField()
