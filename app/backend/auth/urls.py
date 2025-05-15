from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    LogoutView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
