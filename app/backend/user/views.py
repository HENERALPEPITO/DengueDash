from rest_framework import permissions
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from api.pagination import APIPagination
from user.serializers import (
    AdminBrowseUserSerializer,
    MyUserSerializer,
    UsersListSerializer,
    UsersUnverifiedListSerializer,
    RegisterUserSerializer,
)
from auth.permission import IsUserAdmin

User = get_user_model()


class MyUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = MyUserSerializer(request.user)
        return Response(serializer.data)


class AdminBrowseUserView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsUserAdmin)

    def get(self, request, user_id):
        user = User.objects.filter(
            id=user_id,
            is_legacy=False,
            is_verified=True,
            dru_id=request.user.dru.id,
        ).first()

        if user is None:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AdminBrowseUserSerializer(user)
        return Response(serializer.data)


class BaseUserListView(ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsUserAdmin]
    pagination_class = APIPagination

    def get_queryset(self):
        raise NotImplementedError("Subclasses must implement this method")


class UsersListView(BaseUserListView):
    serializer_class = UsersListSerializer

    def get_queryset(self):
        current_user = self.request.user
        return User.objects.filter(
            dru_id=current_user.dru.id,
            is_verified=True,
            is_legacy=False,
        )


class UsersUnverifiedListView(BaseUserListView):
    serializer_class = UsersUnverifiedListSerializer

    def get_queryset(self):
        current_user = self.request.user
        return User.objects.filter(
            dru_id=current_user.dru.id,
            is_verified=False,
        )


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
