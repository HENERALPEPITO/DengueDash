from rest_framework import serializers
from case.models import (
    Case,
    Patient,
)
from api.custom_exceptions.custom_validation_exception import CustomValidationException


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class CaseSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()

    class Meta:
        model = Case
        fields = "__all__"

    def validate(self, data):
        # NS1 Result Validation
        if data.get("ns1_result") != "PR" and data.get("date_ns1") is None:
            raise CustomValidationException(
                "NS1 date must not be empty",
            )
        if data.get("ns1_result") == "PR" and data.get("date_ns1") is not None:
            raise CustomValidationException(
                "NS1 date must be null",
            )

        # IgG ELISA Validation
        if data.get("igg_elisa") != "PR" and data.get("date_igg_elisa") is None:
            raise CustomValidationException(
                "IgG ELISA date must not be empty",
            )
        if data.get("igg_elisa") == "PR" and data.get("date_igg_elisa") is not None:
            raise CustomValidationException(
                "IgG ELISA date must be null",
            )

        # IgM ELISA Validation
        if data.get("igm_elisa") != "PR" and data.get("date_igm_elisa") is None:
            raise CustomValidationException(
                "IgM ELISA date must not be empty",
            )
        if data.get("igm_elisa") == "PR" and data.get("date_igm_elisa") is not None:
            raise CustomValidationException(
                "IgM ELISA date must be null",
            )

        # Death Validation
        if data.get("outcome") == "D" and data.get("date_death") is None:
            raise CustomValidationException("Death date must not be empty")
        if data.get("outcome") == "A" and data.get("date_death") is not None:
            raise CustomValidationException("Death date must be null")

        return data

    def create(self, validated_data):
        # Extract the patient data from the nested data
        patient_data = validated_data.pop("patient")

        # Find or create the patient
        patient, _ = Patient.objects.update_or_create(
            first_name=patient_data["first_name"],
            last_name=patient_data["last_name"],
            middle_name=patient_data.get("middle_name", ""),
            suffix=patient_data.get("suffix", ""),
            date_of_birth=patient_data["date_of_birth"],
            sex=patient_data["sex"],
            defaults=patient_data,
        )

        # Check if a case with the same patient and date_onset already exists
        date_con = validated_data["date_con"]
        if Case.objects.filter(
            patient=patient,
            date_con=date_con,
        ).exists():
            raise serializers.ValidationError(
                {"err_msg": "Case already exists"},
            )

        # Check if a case with the same patient that is already dead
        if Case.objects.filter(
            patient=patient,
            outcome="D",
        ).exists():
            raise serializers.ValidationError(
                {"err_msg": "Patient is already dead"},
            )

        # Create and return the new case linked to the patient
        return Case.objects.create(
            patient=patient,
            **validated_data,
        )
