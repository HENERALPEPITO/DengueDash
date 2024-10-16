from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
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


class UserClassificationView(generics.ListAPIView):
    queryset = UserClassification.objects.exclude(classification="Admin")
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserClassificationSerializer


class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
