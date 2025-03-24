from django.urls import path
from .views.patient_case_view import PatientCaseView
from .views.case_report_view import CaseReportView, CaseDetailedView, CaseDeleteView
from .views.case_count_view import (
    QuickStatisticsView,
    DenguePublicLocationStatView,
    DengueAuthenticatedLocationStatView,
    DengueDateStatView,
)

urlpatterns = [
    path("create/", PatientCaseView.as_view(), name="case-create"),
    path("reports/", CaseReportView.as_view(), name="case-reports"),
    path("reports/<int:case_id>/", CaseDetailedView.as_view(), name="case-detail"),
    path("delete/<int:case_id>/", CaseDeleteView.as_view(), name="case-delete"),
    # Stats
    path("stat/", QuickStatisticsView.as_view(), name="case-stat-quick"),
    path(
        "stat/public/location/",
        DenguePublicLocationStatView.as_view(),
        name="case-stat-public-location",
    ),
    path(
        "stat/auth/location/",
        DengueAuthenticatedLocationStatView.as_view(),
        name="case-stat-auth-location",
    ),
    path("stat/by-date/", DengueDateStatView.as_view(), name="case-stat-by-date"),
]
