from rest_framework import permissions
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from case.models import Case
from case.serializers.case_report_serializers import CaseReportSerializer
from case.serializers.case_report_serializers import CaseViewSerializer
from api.pagination import APIPagination


class CaseReportView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CaseReportSerializer
    pagination_class = APIPagination

    def get_queryset(self):
        # Filter cases based on the authenticated user
        user_id = self.request.user.id
        return Case.objects.filter(
            interviewer_id=user_id,
        ).order_by("-date_con")


class CaseDetailedView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, case_id):
        case = Case.objects.get(case_id=case_id)
        serializer = CaseViewSerializer(case)
        return Response(serializer.data)
