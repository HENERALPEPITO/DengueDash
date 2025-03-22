from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from datetime import datetime
from case.models import Case
from case.serializers.case_statistics_serializers import (
    QuickStatisticsSerializer,
    LocationStatSerializer,
    DateStatSerializer,
)


class QuickStatisticsView(APIView):
    # todo: filter by surveillance unit/municipality
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        current_year = datetime.now().year
        current_week = datetime.now().isocalendar()[1]
        if year := request.query_params.get("year"):
            total_cases = Case.objects.filter(date_con__year=year).count()
            total_deaths = Case.objects.filter(
                outcome="D",
                date_con__year=year,
            ).count()
            total_severe_cases = Case.objects.filter(
                clncl_class="S",
                date_con__year=year,
            ).count()
            total_lab_confirmed_cases = Case.objects.filter(
                Q(ns1_result="P") | Q(igg_elisa="P") | Q(igm_elisa="P"),
                date_con__year=year,
            ).count()

            if year == str(current_year):
                weekly_cases = Case.objects.filter(
                    date_con__year=current_year,
                    date_con__week=current_week,
                ).count()
                weekly_deaths = Case.objects.filter(
                    outcome="D",
                    date_con__year=current_year,
                    date_con__week=current_week,
                ).count()
                weekly_severe_cases = Case.objects.filter(
                    clncl_class="S",
                    date_con__year=current_year,
                    date_con__week=current_week,
                ).count()
                weekly_lab_confirmed_cases = Case.objects.filter(
                    Q(ns1_result="P") | Q(igg_elisa="P") | Q(igm_elisa="P"),
                    date_con__year=current_year,
                    date_con__week=current_week,
                ).count()
            else:
                weekly_cases = None
                weekly_deaths = None
                weekly_severe_cases = None
                weekly_lab_confirmed_cases = None

        else:
            total_cases = Case.objects.all().count()
            total_deaths = Case.objects.filter(outcome="D").count()
            total_severe_cases = Case.objects.filter(clncl_class="S").count()
            total_lab_confirmed_cases = Case.objects.filter(
                Q(ns1_result="P") | Q(igg_elisa="P") | Q(igm_elisa="P")
            ).count()

            weekly_cases = None
            weekly_deaths = None
            weekly_severe_cases = None
            weekly_lab_confirmed_cases = None

        data = {
            "total_cases": total_cases,
            "total_deaths": total_deaths,
            "total_severe_cases": total_severe_cases,
            "total_lab_confirmed_cases": total_lab_confirmed_cases,
            "weekly_cases": weekly_cases,
            "weekly_deaths": weekly_deaths,
            "weekly_severe_cases": weekly_severe_cases,
            "weekly_lab_confirmed_cases": weekly_lab_confirmed_cases,
        }

        serializer = QuickStatisticsSerializer(data, many=False)
        return Response(serializer.data)


class DengueDateStatView(APIView):
    # todo: filter by surveillance unit/municipality
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
            START_YEAR = 2011
            filter_criteria = {"date_con__year__gte": START_YEAR}
            data = self.aggregate_data("date_con__year", filter_criteria, label="year")

        serializer = DateStatSerializer(data, many=True)
        return Response(serializer.data)


class BaseLocationStatView(APIView):

    def filter_by_date(self, request, cases):
        if year := request.query_params.get("year"):
            cases = cases.filter(date_con__year=year)
        if month := request.query_params.get("month"):
            cases = cases.filter(date_con__month=month)
        if week := request.query_params.get("week"):
            cases = cases.filter(date_con__week=week)
        if date := request.query_params.get("date"):
            cases = cases.filter(date_con=date)
        return cases

    def filter_by_location(self, request, cases):
        """
        By default, apply location filters from the query parameters.
        This method will be overridden in the authenticated view.
        """
        if region := request.query_params.get("region"):
            cases = cases.filter(patient__addr_region=region)
        if province := request.query_params.get("province"):
            cases = cases.filter(patient__addr_province=province)
        if city := request.query_params.get("city"):
            cases = cases.filter(patient__addr_city=city)
        if barangay := request.query_params.get("barangay"):
            cases = cases.filter(patient__addr_barangay=barangay)
        return cases

    def get_group_field(self, request):
        """
        Determines the grouping field based on a 'group_by' query parameter or the most granular provided filter.
        """
        group_by_param = request.query_params.get("group_by")
        mapping = {
            "barangay": "patient__addr_barangay",
            "municipality": "patient__addr_mun",
            "province": "patient__addr_province",
            "region": "patient__addr_region",
            "city": "patient__addr_city",
        }
        if group_by_param in mapping:
            return mapping[group_by_param]

        # If no explicit group_by is provided, use whichever location filter is present.
        if request.query_params.get("barangay"):
            return "patient__addr_barangay"
        elif request.query_params.get("city"):
            return "patient__addr_city"
        elif request.query_params.get("municipality"):
            return "patient__addr_mun"
        elif request.query_params.get("province"):
            return "patient__addr_province"
        elif request.query_params.get("region"):
            return "patient__addr_region"
        return "patient__addr_barangay"  # Default grouping

    def get_data(self, request):
        cases = Case.objects.all()
        cases = self.filter_by_date(request, cases)
        cases = self.filter_by_location(request, cases)
        group_field = self.get_group_field(request)

        # Aggregate case counts
        cases_per_location = (
            cases.values(group_field)
            .annotate(case_count=Count("case_id"))
            .order_by("-case_count")
        )
        # Aggregate death counts
        deaths_per_location = (
            cases.filter(outcome="D")
            .values(group_field)
            .annotate(death_count=Count("case_id"))
            .order_by("-death_count")
        )
        # Create lookup for death counts
        death_counts = {
            item[group_field]: item["death_count"] for item in deaths_per_location
        }
        # Combine into final data
        data = [
            {
                "location": item[group_field],
                "case_count": item["case_count"],
                "death_count": death_counts.get(item[group_field], 0),
            }
            for item in cases_per_location
        ]
        return data

    def get(self, request, *args, **kwargs):
        data = self.get_data(request)
        serializer = LocationStatSerializer(data, many=True)
        return Response(serializer.data)


class DenguePublicLocationStatView(BaseLocationStatView):
    permission_classes = (permissions.AllowAny,)


class DengueAuthenticatedLocationStatView(BaseLocationStatView):
    permission_classes = (permissions.IsAuthenticated,)

    def filter_by_location(self, request, cases):
        # Override to filter by the authenticated user's location
        user = request.user
        dru_type = str(user.dru.dru_type)
        print(dru_type)
        if dru_type == "RESU":
            cases = cases.filter(patient__addr_region=user.dru.region)
        elif dru_type == "PESU":
            cases = cases.filter(patient__addr_province=user.dru.addr_province)
        elif dru_type == "CESU":
            cases = cases.filter(patient__addr_city=user.dru.addr_city)
        return cases
