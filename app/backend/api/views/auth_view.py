from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.conf import settings
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from auth.serializers import (
    RegisterSerializer,
    LoginSerializer,
)
from user.serializers import (
    UserClassificationSerializer,
    UserSerializer,
)
from user.models import UserClassification
import environs

env = environs.Env()
env.read_env()

SECRET_KEY = env("SECRET_KEY")

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            data = response.data
            access_token = data.get("access")
            refresh_token = data.get("refresh")

            res = JsonResponse(
                {
                    "success": True,
                    "message": "Logged in successfully",
                    # todo: remove in the future due to security purposes
                    "access_token": access_token,
                    "refresh_token": refresh_token,
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

        return response


class UserClassificationView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)

    queryset = UserClassification.objects.exclude(classification="Admin")
    serializer_class = UserClassificationSerializer


class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class AuthCheckView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, _):
        return JsonResponse({"is_authenticated": True})
