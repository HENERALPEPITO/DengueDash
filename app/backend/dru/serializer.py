from rest_framework import serializers
from .models import DRU, DRUType


class DRUSerializer(serializers.ModelSerializer):
    class Meta:
        model = DRU
        exclude = ["id"]


class DRUTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DRUType
        fields = ["dru_classification"]
