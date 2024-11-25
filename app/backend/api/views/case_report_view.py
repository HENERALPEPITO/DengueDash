from rest_framework import permissions
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from case.models import Case
from case.serializers.case_report_serializers import CaseReportSerializer
from case.serializers.case_report_serializers import CaseViewSerializer
from api.pagination import APIPagination
from user.models import User


class CaseReportView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CaseReportSerializer
    pagination_class = APIPagination

    def get_queryset(self):
        # Get the authenticated user
        user = self.request.user

        # Retrieve user classification
        classification = user.classification.classification

        # Determine the filtering criteria based on classification
        filter_kwargs = {}
        if classification == "admin_region":
            # Filter by region
            filter_kwargs["interviewer__dru__region"] = user.dru.region
        elif classification == "admin_local":
            # Filter by surveillance unit
            filter_kwargs["interviewer__dru__surveillance_unit"] = (
                user.dru.surveillance_unit
            )
        elif classification == "admin_dru":
            # Filter by DRU
            filter_kwargs["interviewer__dru"] = user.dru
        else:
            # Default: Filter by the authenticated user as interviewer
            filter_kwargs["interviewer"] = user

        # Return the filtered queryset
        return Case.objects.filter(**filter_kwargs).order_by("-date_con")


class CaseDetailedView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, case_id):
        case = Case.objects.get(case_id=case_id)
        serializer = CaseViewSerializer(case)
        return Response(serializer.data)
