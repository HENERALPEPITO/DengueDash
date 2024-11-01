from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from api.models.case import Case
from api.serializers.dengue_count_serializer import DengueCountSerializer


class BarangayCountView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        year = request.query_params.get("year")

        cases = Case.objects.all()
        if year:
            cases = cases.filter(date_con__year=year)

        cases_per_barangay = (
            cases.values("patient__ca_barangay")
            .annotate(case_count=Count("case_id"))
            .order_by("-case_count")
        )

        data = [
            {"barangay": item["patient__ca_barangay"], "case_count": item["case_count"]}
            for item in cases_per_barangay
        ]

        # Serialize the data
        serializer = DengueCountSerializer(data, many=True)
        return Response(serializer.data)
