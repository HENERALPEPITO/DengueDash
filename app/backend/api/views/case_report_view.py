from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from case.models import Case
from case.serializers.case_report_serializers import CaseReportSerializer
from case.serializers.case_report_serializers import CaseViewSerializer
from api.pagination import APIPagination
from django.db.models import Case as DBCase, Value, When


def get_filter_criteria(user, action="view"):
    """
    Generate filter criteria based on user classification and action type.
    - action: "view" or "delete"
    """
    if action == "delete":
        # For deleting, users can only delete their own created records
        return {"interviewer": user}
    classification = user.classification.classification

    if classification == "admin_local":
        return {"interviewer__dru__surveillance_unit": user.dru.surveillance_unit}
    elif classification == "admin_region":
        return {"interviewer__dru__region": user.dru.region}
    else:
        return {"interviewer__dru": user.dru}


class CaseReportView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CaseReportSerializer
    pagination_class = APIPagination

    def get_queryset(self):
        # Get the authenticated user
        user = self.request.user

        # Generate filter criteria using the helper function
        filter_kwargs = get_filter_criteria(user)

        # Get search query from the request parameters
        search_query = self.request.query_params.get("search", None)

        # Base queryset
        queryset = Case.objects.filter(**filter_kwargs)

        # Annotate human-readable labels for clncl_class and case_class
        clncl_class_choices = dict(Case._meta.get_field("clncl_class").choices)
        case_class_choices = dict(Case._meta.get_field("case_class").choices)

        queryset = queryset.annotate(
            clncl_class_label=DBCase(
                *[
                    When(clncl_class=key, then=Value(label))
                    for key, label in clncl_class_choices.items()
                ]
            ),
            case_class_label=DBCase(
                *[
                    When(case_class=key, then=Value(label))
                    for key, label in case_class_choices.items()
                ]
            ),
        )

        # If a search query is provided, filter further
        if search_query:
            queryset = (
                # Patient details
                queryset.filter(patient__first_name__icontains=search_query)
                | queryset.filter(patient__last_name__icontains=search_query)
                | queryset.filter(patient__addr_barangay__icontains=search_query)
                | queryset.filter(patient__addr_city__icontains=search_query)
                # Case details
                | queryset.filter(date_con__icontains=search_query)
                # Case details using annotated labels
                | queryset.filter(clncl_class_label__icontains=search_query)
                | queryset.filter(case_class_label__icontains=search_query)
            )

        # Return the filtered queryset, ordered by date of consultation
        return queryset.order_by("-date_con")


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
        serializer = CaseViewSerializer(case, context={"request": request})
        return Response(serializer.data)


class CaseDeleteView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, case_id):
        user = request.user
        filter_kwargs = get_filter_criteria(user, action="delete")

        # Attempt to retrieve the case based on user credentials
        case = Case.objects.filter(
            case_id=case_id,
            **filter_kwargs,
        ).first()

        if case is None:
            # Raise a PermissionDenied exception if no case is found
            raise PermissionDenied(
                detail="You do not have the necessary permissions to access this case or the case does not exist."
            )
        case.delete()
        return Response({"message": "Case deleted successfully."})
