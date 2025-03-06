from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from user.serializers import (
    UserClassificationSerializer,
    UserSerializer,
)
from user.models import UserClassification


class UserClassificationView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)

    queryset = UserClassification.objects.exclude(classification="Admin")
    serializer_class = UserClassificationSerializer


class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
