from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from case.models import Case
from case.serializers.case_report_serializers import CaseReportSerializer
from case.serializers.case_report_serializers import CaseViewSerializer
from api.pagination import APIPagination
from user.models import User


def get_filter_criteria(user):
    """
    Helper function to generate filter criteria based on user classification.
    """
    classification = user.classification.classification
    if classification == "admin_region":
        # Filter by region
        return {"interviewer__dru__region": user.dru.region}
    elif classification == "admin_local":
        # Filter by surveillance unit
        return {"interviewer__dru__surveillance_unit": user.dru.surveillance_unit}
    elif classification == "admin_dru":
        # Filter by DRU
        return {"interviewer__dru": user.dru}
    else:
        # Default: Filter by the authenticated user as interviewer
        return {"interviewer": user}


class CaseReportView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CaseReportSerializer
    pagination_class = APIPagination

    def get_queryset(self):
        # Get the authenticated user
        user = self.request.user

        # Generate filter criteria using the helper function
        filter_kwargs = get_filter_criteria(user)

        # Return the filtered queryset
        return Case.objects.filter(**filter_kwargs).order_by("-date_con")


class CaseDetailedView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, case_id):
        user = request.user
        filter_kwargs = get_filter_criteria(user)

        # Attempt to retrieve the case based on user credentials
        case = Case.objects.filter(
            case_id=case_id,
            **filter_kwargs,
        ).first()

        if case is None:
            # Raise a PermissionDenied exception if no case is found
            raise PermissionDenied(
                detail="You do not have the necessary permissions to access this case."
            )

        # Serialize and return the case data
        serializer = CaseViewSerializer(case)
        return Response(serializer.data)
