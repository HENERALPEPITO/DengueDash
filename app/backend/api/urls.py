from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from auth.views import (
    RegisterUserView,
    LoginView,
    AuthCheckView,
)
from user.views import (
    # UserClassificationView,
    UserDetailView,
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
from dru.views import RegisterDRUView

from weather.views import WeatherView

from lstm_prediction.views import LstmPredictionView


urlpatterns = [
    path(
        "register/user/",
        RegisterUserView.as_view(),
        name="register-user",
    ),
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
        "register/dru/",
        RegisterDRUView.as_view(),
        name="register-dru",
    ),
    # path(
    #     "classifications/",
    #     UserClassificationView.as_view(),
    #     name="classifications",
    # ),
    path(
        "auth/check",
        AuthCheckView.as_view(),
        name="auth-check",
    ),
    path(
        "user/",
        UserDetailView.as_view(),
        name="user",
    ),
    path(
        "case/create/",
        PatientCaseView.as_view(),
        name="create-case",
    ),
    path(
        "dengue-case-reports",
        CaseReportView.as_view(),
        name="case-reports",
    ),
    path(
        "dengue-case-reports/<int:case_id>",
        CaseDetailedView.as_view(),
        name="case-detailed",
    ),
    path(
        "quick-stat",
        QuickStatisticsView.as_view(),
        name="quick-stat",
    ),
    path(
        "cases-per-barangay",
        BarangayCountView.as_view(),
        name="cases-per-barangay",
    ),
    path(
        "cases-deaths",
        DengueCountDeathsView.as_view(),
        name="cases-deaths",
    ),
    path(
        "weather",
        WeatherView.as_view(),
        name="weather",
    ),
    # Delete
    path(
        "case/delete/<int:case_id>",
        CaseDeleteView.as_view(),
        name="case-delete",
    ),
    # LSTM Prediction
    path(
        "predict",
        LstmPredictionView.as_view(),
        name="lstm-predict",
    ),
]
