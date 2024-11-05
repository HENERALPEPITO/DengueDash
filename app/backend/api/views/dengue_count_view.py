from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from api.models.case import Case
from api.serializers.dengue_count_serializer import (
    MapDengueCountSerializer,
    YearlyDengueCountSerializer,
)


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

        deaths_per_barangay = (
            cases.filter(outcome="D")
            .values("patient__ca_barangay")
            .annotate(death_count=Count("case_id"))
        )

        death_counts = {
            item["patient__ca_barangay"]: item["death_count"]
            for item in deaths_per_barangay
        }

        data = [
            {
                "barangay": item["patient__ca_barangay"],
                "case_count": item["case_count"],
                # Default is 0 if no deaths
                "death_count": death_counts.get(item["patient__ca_barangay"], 0),
            }
            for item in cases_per_barangay
        ]

        serializer = MapDengueCountSerializer(data, many=True)
        return Response(serializer.data)


class YearlyDengueCountStatView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        start_year = 2016

        # Aggregate cases per year
        cases_per_year = (
            Case.objects.filter(date_con__year__gte=start_year)
            .values("date_con__year")
            .annotate(case_count=Count("case_id"))
            .order_by("date_con__year")
        )

        # Aggregate deaths per year
        death_per_year = (
            Case.objects.filter(date_con__year__gte=start_year)
            .values("date_con__year")
            .annotate(death_count=Count("case_id", filter=Q(outcome="D")))
            .order_by("date_con__year")
        )

        # Convert death_per_year to a dictionary for easy lookup
        death_dict = {
            item["date_con__year"]: item["death_count"] for item in death_per_year
        }

        data = [
            {
                "year": item["date_con__year"],
                "case_count": item["case_count"],
                "death_count": death_dict.get(item["date_con__year"], 0),
            }
            for item in cases_per_year
        ]

        serializer = YearlyDengueCountSerializer(data, many=True)
        return Response(serializer.data)
