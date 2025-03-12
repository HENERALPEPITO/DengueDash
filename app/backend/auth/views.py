from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from auth.serializers import (
    LoginSerializer,
)

import environs

env = environs.Env()
env.read_env()

SECRET_KEY = env("SECRET_KEY")

User = get_user_model()


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        # Instantiate the serializer with request data
        serializer_instance = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer_instance.is_valid(raise_exception=True)
        data = serializer_instance.validated_data
        access_token = data.get("access")
        refresh_token = data.get("refresh")

        res = JsonResponse(
            {
                "success": True,
                "message": "Logged in successfully",
                # todo: remove in the future due to security purposes
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user_data": data.get("user_data"),
            }
        )

        # Set the access token cookie
        res.set_cookie(
            key=settings.SIMPLE_JWT["ACCESS_COOKIE"],
            value=access_token,
            domain=settings.SIMPLE_JWT["COOKIE_DOMAIN"],
            path=settings.SIMPLE_JWT["ACCESS_COOKIE_PATH"],
            expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["COOKIE_SAMESITE"],
        )

        # Set the refresh token cookie
        res.set_cookie(
            key=settings.SIMPLE_JWT["REFRESH_COOKIE"],
            value=refresh_token,
            domain=settings.SIMPLE_JWT["COOKIE_DOMAIN"],
            path=settings.SIMPLE_JWT["REFRESH_COOKIE_PATH"],
            expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["COOKIE_SAMESITE"],
        )

        return res


class AuthCheckView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, _):
        return JsonResponse({"is_authenticated": True})
