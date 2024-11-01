from rest_framework import permissions
from rest_framework.generics import ListAPIView
from api.models.case import Case
from api.serializers.case_report_serializer import CaseReportSerializer
from api.pagination import APIPagination


class CaseReportView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Case.objects.select_related("patient")
    serializer_class = CaseReportSerializer
    pagination_class = APIPagination
