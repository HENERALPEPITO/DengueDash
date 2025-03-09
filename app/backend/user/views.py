from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from user.serializers import (
    UserSerializer,
)

class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
