from rest_framework import permissions
from rest_framework.generics import ListAPIView
from case.models import Case
from case.serializers.case_report_serializers import CaseReportSerializer
from api.pagination import APIPagination


class CaseReportView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Case.objects.all().order_by("-date_con")
    serializer_class = CaseReportSerializer
    pagination_class = APIPagination
