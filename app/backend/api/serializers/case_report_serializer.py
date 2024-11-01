from rest_framework import serializers
from api.models.patient import Patient
from api.models.case import Case
from api.models.user import User


class CaseReportPatientSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            "full_name",
            "ca_barangay",
            "ca_city",
        ]

    def get_full_name(self, obj):
        suffix = obj.suffix if obj.suffix is not None else ""
        return f"{obj.last_name}, {obj.first_name} {obj.middle_name} {suffix}".strip()


class CaseReportSerializer(serializers.ModelSerializer):
    patient = CaseReportPatientSerializer()
    clncl_class_display = serializers.SerializerMethodField()
    case_class_display = serializers.SerializerMethodField()
    outcome_display = serializers.SerializerMethodField()

    class Meta:
        model = Case
        fields = [
            "case_id",
            "date_con",
            "clncl_class_display",
            "case_class_display",
            "patient",
            "outcome_display",
        ]

    def get_clncl_class_display(self, obj):
        return obj.get_clncl_class_display()

    def get_case_class_display(self, obj):
        return obj.get_case_class_display()

    def get_outcome_display(self, obj):
        return obj.get_outcome_display()
