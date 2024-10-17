from rest_framework import serializers
from ..models.patient import Patient
from ..models.case import Case


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class CaseSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()

    class Meta:
        model = Case
        fields = "__all__"

    def create(self, validated_data):
        # Extract the patient data from the nested data
        patient_data = validated_data.pop("patient")

        # Find or create the patient
        patient, _ = Patient.objects.get_or_create(
            first_name=patient_data["first_name"],
            last_name=patient_data["last_name"],
            middle_name=patient_data.get("middle_name", ""),
            date_of_birth=patient_data["date_of_birth"],
            defaults=patient_data,
        )

        # Check if a case with the same patient and date_onset already exists
        date_onset = validated_data["date_onset"]
        if Case.objects.filter(
            patient=patient,
            date_onset=date_onset,
        ).exists():
            raise serializers.ValidationError(
                {"err_msg": "Case already exists"},
            )

        # Create and return the new case linked to the patient
        return Case.objects.create(
            patient=patient,
            **validated_data,
        )
