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
    dru_type = serializers.PrimaryKeyRelatedField(
        queryset=DRUType.objects.all(),
        required=True,
    )
    class Meta:
        model = DRU
        fields = [
            "region",
            "surveillance_unit",
            "dru_name",
            "address",
            "email",
            "contact_number",
            "dru_type",
        ]

    def validate(self, data):
        # Todo: Validate contact number
        
        dru_name = data.get("dru_name")
        surveillance_unit = data.get("surveillance_unit")
        if DRU.objects.filter(
            surveillance_unit=surveillance_unit,
            dru_name=dru_name,
        ).exists():
            raise serializers.ValidationError(
                {
                    "success" : False,
                    "message" : "DRU already exists"
                }
            )
        
        return data
        
    def create(self, validated_data):
        dru = DRU.objects.create(**validated_data)
        return dru