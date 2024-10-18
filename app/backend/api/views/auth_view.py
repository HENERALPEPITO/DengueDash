from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers.auth_serializer import (
    RegisterSerializer,
    LoginSerializer,
)
from ..serializers.user_serializer import (
    UserClassificationSerializer,
    UserSerializer,
)
from ..models.user import UserClassification

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
                    "sucess": True,
                    "message": "Logged in sucessfuly",
                    # todo: remove in the future due to security purposes
                    "access_token": access_token,
                }
            )

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,  # Prevent JS access
                secure=True,  # Send over HTTPS
                samesite="Strict",  # Prevent CSRF attacks
            )

            return res

        return response


class UserClassificationView(generics.ListAPIView):
    queryset = UserClassification.objects.exclude(classification="Admin")
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserClassificationSerializer


class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
