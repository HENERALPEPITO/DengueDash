from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from user.serializers import (
    UserSerializer,
    RegisterUserSerializer,
)


class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegisterUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterUserSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(
                {
                    "success": True,
                    "message": "User registered successfully",
                }
            )

        return JsonResponse({"success": False, "message": serializer.errors})
