from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views.auth_view import (
    RegisterView,
    LoginView,
    UserClassificationView,
    UserDetailView,
)
from .views.patient_case_view import PatientCaseView


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("classifications/", UserClassificationView.as_view(), name="classifications"),
    path("user/", UserDetailView.as_view(), name="user"),
    path("case/create/", PatientCaseView.as_view(), name="create-case"),
]
