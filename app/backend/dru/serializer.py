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


class RegisterDRUSerializer(serializers.ModelSerializer):
    class Meta:
        model = DRU
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
