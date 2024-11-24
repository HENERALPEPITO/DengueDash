from rest_framework import serializers
from case.models import (
    Case,
    Patient,
)
from user.models import User


class CaseReportPatientSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            "full_name",
            "addr_barangay",
            "addr_city",
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


class CaseInterviewerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    dru = serializers.StringRelatedField()

    class Meta:
        model = User
        fields = [
            "full_name",
            "dru",
        ]

    def get_full_name(self, obj):
        return f"{obj.last_name}, {obj.first_name} {obj.middle_name}".strip()


class PatientViewSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    curr_full_address = serializers.SerializerMethodField()
    sex_display = serializers.SerializerMethodField()
    civil_status_display = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            "full_name",
            "curr_full_address",
            "sex_display",
            "civil_status_display",
            "date_first_vax",
            "date_last_vax",
        ]

    def get_full_name(self, obj):
        suffix = obj.suffix if obj.suffix is not None else ""
        return f"{obj.last_name}, {obj.first_name} {obj.middle_name} {suffix}".strip()

    def get_curr_full_address(self, obj):
        return f"{obj.addr_house_no} {obj.addr_street}, {obj.addr_barangay}, {obj.addr_city}, {obj.addr_province}".strip()

    def get_sex_display(self, obj):
        return obj.get_sex_display()

    def get_civil_status_display(self, obj):
        return obj.get_civil_status_display()


class CaseViewSerializer(serializers.ModelSerializer):
    clncl_class_display = serializers.SerializerMethodField()
    ns1_result_display = serializers.SerializerMethodField()
    igg_elisa_display = serializers.SerializerMethodField()
    igm_elisa_display = serializers.SerializerMethodField()
    pcr_display = serializers.SerializerMethodField()
    case_class_display = serializers.SerializerMethodField()
    outcome_display = serializers.SerializerMethodField()
    patient = PatientViewSerializer()
    interviewer = CaseInterviewerSerializer()

    class Meta:
        model = Case
        fields = [
            "case_id",
            "date_con",
            "is_admt",
            "date_onset",
            "clncl_class_display",
            "ns1_result_display",
            "date_ns1",
            "igg_elisa_display",
            "date_igg_elisa",
            "igm_elisa_display",
            "date_igm_elisa",
            "pcr_display",
            "date_pcr",
            "case_class_display",
            "outcome_display",
            "date_death",
            "patient",
            "interviewer",
        ]

    def get_clncl_class_display(self, obj):
        return obj.get_clncl_class_display()

    def get_ns1_result_display(self, obj):
        return obj.get_ns1_result_display()

    def get_igg_elisa_display(self, obj):
        return obj.get_igg_elisa_display()

    def get_igm_elisa_display(self, obj):
        return obj.get_igm_elisa_display()

    def get_pcr_display(self, obj):
        return obj.get_pcr_display()

    def get_case_class_display(self, obj):
        return obj.get_case_class_display()

    def get_outcome_display(self, obj):
        return obj.get_outcome_display()
