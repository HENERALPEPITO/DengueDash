from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from auth.views import (
    LoginView,
    # AuthCheckView,
)
from user.views import (
    AdminBrowseUserView,
    MyUserView,
    UsersListView,
    UsersUnverifiedListView,
    VerifiyUserView,
    DeleteUserView,
    ToggleUserRoleView,
    RegisterUserView,
)
from case.views.patient_case_view import PatientCaseView
from case.views.case_report_view import (
    CaseReportView,
    CaseDetailedView,
    CaseDeleteView,
)
from case.views.case_count_view import (
    QuickStatisticsView,
    BarangayCountView,
    DengueCountDeathsView,
)
from dru.views import (
    RegisterDRUView,
    DRUHierarchyView,
    DRUListView,
    DRUProfileView,
    DRUTypeView,
    DeleteDRUView,
)

from weather.views import WeatherView

from lstm_prediction.views import LstmPredictionView


urlpatterns = [
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),
    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "dru/types/",
        DRUTypeView.as_view(),
        name="dru-types",
    ),
    path(
        "dru/hierarchy/",
        DRUHierarchyView.as_view(),
        name="dru-hierarchy",
    ),
    path(
        "dru/list/",
        DRUListView.as_view(),
        name="dru-list",
    ),
    path(
        "dru/<int:dru_id>/",
        DRUProfileView.as_view(),
        name="dru-list",
    ),
    path(
        "dru/register/",
        RegisterDRUView.as_view(),
        name="dru-register",
    ),
    path(
        "dru/delete/<int:dru_id>/",
        DeleteDRUView.as_view(),
        name="dru-delete",
    ),
    # path(
    #     "auth/check/",
    #     AuthCheckView.as_view(),
    #     name="auth-check",
    # ),
    path(
        "user/me/",
        MyUserView.as_view(),
        name="my-user",
    ),
    path(
        "user/<int:user_id>/",
        AdminBrowseUserView.as_view(),
        name="user-browse",
    ),
    path(
        "user/list/",
        UsersListView.as_view(),
        name="user-list",
    ),
    path(
        "user/list/unverified/",
        UsersUnverifiedListView.as_view(),
        name="user-list-unverified",
    ),
    path(
        "user/verify/<int:user_id>/",
        VerifiyUserView.as_view(),
        name="user-verify",
    ),
    path(
        "user/toggle-role/<int:user_id>/",
        ToggleUserRoleView.as_view(),
        name="user-toggle-role",
    ),
    path(
        "user/register/",
        RegisterUserView.as_view(),
        name="register-user",
    ),
    path(
        "user/delete/<int:user_id>/",
        DeleteUserView.as_view(),
        name="user-delete",
    ),
    path(
        "case/create/",
        PatientCaseView.as_view(),
        name="create-case",
    ),
    path(
        "dengue-case-reports/",
        CaseReportView.as_view(),
        name="case-reports",
    ),
    path(
        "dengue-case-reports/<int:case_id>/",
        CaseDetailedView.as_view(),
        name="case-detailed",
    ),
    path(
        "quick-stat/",
        QuickStatisticsView.as_view(),
        name="quick-stat/",
    ),
    path(
        "cases-per-barangay/",
        BarangayCountView.as_view(),
        name="cases-per-barangay",
    ),
    path(
        "cases/deaths/",
        DengueCountDeathsView.as_view(),
        name="cases-deaths",
    ),
    path(
        "weather/",
        WeatherView.as_view(),
        name="weather",
    ),
    # Delete
    path(
        "case/delete/<int:case_id>/",
        CaseDeleteView.as_view(),
        name="case-delete",
    ),
    # LSTM Prediction
    path(
        "predict/",
        LstmPredictionView.as_view(),
        name="lstm-predict",
    ),
]
