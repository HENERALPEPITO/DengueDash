from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from datetime import datetime
from case.models import Case
from case.serializers.case_statistics_serializers import (
    CurrentDengueCountSerializer,
    MapDengueCountSerializer,
    DengueCountDeathsSerializer,
)


class CurrentDengueCountView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        current_year = datetime.now().year
        current_week = datetime.now().isocalendar()[1]

        total_cases = Case.objects.filter(
            date_con__year=current_year,
        ).count()

        total_deaths = Case.objects.filter(
            outcome="D",
            date_con__year=current_year,
        ).count()

        weekly_cases = Case.objects.filter(
            date_con__year=current_year,
            date_con__week=current_week,
        ).count()

        weekly_deaths = Case.objects.filter(
            outcome="D",
            date_con__year=current_year,
            date_con__week=current_week,
        ).count()

        data = {
            "total_cases": total_cases,
            "total_deaths": total_deaths,
            "weekly_cases": weekly_cases,
            "weekly_deaths": weekly_deaths,
        }

        serializer = CurrentDengueCountSerializer(data, many=False)
        return Response(serializer.data)


from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Q


class DengueCountDeathsView(APIView):
    permission_classes = (permissions.AllowAny,)

    def aggregate_data(self, date_field, filter_criteria, label):
        """Helper function to aggregate cases and deaths."""
        cases = (
            Case.objects.filter(**filter_criteria)
            .values(date_field)
            .annotate(case_count=Count("case_id"))
            .order_by(date_field)
        )

        deaths = (
            Case.objects.filter(**filter_criteria)
            .values(date_field)
            .annotate(death_count=Count("case_id", filter=Q(outcome="D")))
            .order_by(date_field)
        )

        # Convert deaths to a dictionary for easy lookup
        death_dict = {item[date_field]: item["death_count"] for item in deaths}

        return [
            {
                # Output year if label is year, else output Week <week_number>
                "label": (
                    f"{label.capitalize()} {item[date_field]}"
                    if label == "week"
                    else item[date_field]
                ),
                "case_count": item["case_count"],
                "death_count": death_dict.get(item[date_field], 0),
            }
            for item in cases
        ]

    def get(self, request, *args, **kwargs):
        if year := request.query_params.get("year"):
            # Weekly aggregation for a specific year
            filter_criteria = {"date_con__year": year}
            data = self.aggregate_data("date_con__week", filter_criteria, label="week")
        else:
            # Yearly aggregation from START_YEAR onwards
            START_YEAR = 2016
            filter_criteria = {"date_con__year__gte": START_YEAR}
            data = self.aggregate_data("date_con__year", filter_criteria, label="year")

        serializer = DengueCountDeathsSerializer(data, many=True)
        return Response(serializer.data)


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
