from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views.auth_view import (
    RegisterView,
    LoginView,
    UserClassificationView,
    UserDetailView,
    AuthCheckView,
)
from .views.patient_case_view import PatientCaseView
from .views.case_report_view import CaseReportView
from .views.dengue_count_view import (
    CurrentDengueCountView,
    BarangayCountView,
    YearlyDengueCountStatView,
)


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("classifications/", UserClassificationView.as_view(), name="classifications"),
    path("auth/check", AuthCheckView.as_view(), name="auth-check"),
    path("user/", UserDetailView.as_view(), name="user"),
    path("case/create/", PatientCaseView.as_view(), name="create-case"),
    path("dengue-case-reports", CaseReportView.as_view(), name="case-reports"),
    path(
        "current-case-count",
        CurrentDengueCountView.as_view(),
        name="current-case-count",
    ),
    path("cases-per-barangay", BarangayCountView.as_view(), name="cases-per-barangay"),
    path("cases-per-year", YearlyDengueCountStatView.as_view(), name="cases-per-year"),
]
