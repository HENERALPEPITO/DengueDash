from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from auth.serializers import (
    RegisterSerializer,
    LoginSerializer,
)
from dru.models import DRU

import environs

env = environs.Env()
env.read_env()

SECRET_KEY = env("SECRET_KEY")

User = get_user_model()


# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = RegisterSerializer

#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context.update({"request": self.request})
#         return context


class RegisterUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        current_user = request.user
        if not current_user.is_admin:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You are not authorized to perform this action",
                },
            )

        user = request.user

        if "dru" not in request.data:
            return JsonResponse(
                {
                    "success": False,
                    "message": "DRU is required",
                },
            )

        dru_id = request.data.get("dru")
        try:
            dru_to_register = DRU.objects.filter(id=dru_id).first()
            current_user_dru = user.dru
        except DRU.DoesNotExist:
            return JsonResponse(
                {
                    "success": False,
                    "message": "DRU not found",
                },
            )

        # return JsonResponse(
        #     {
        #         "success": True,
        #         "message": "User registered successfully",
        #         "data": {
        #             "email": user.email,
        #             "first_name": user.first_name,
        #             "middle_name": user.middle_name,
        #             "last_name": user.last_name,
        #         },
        #     }
        # )


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


class AuthCheckView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, _):
        return JsonResponse({"is_authenticated": True})
