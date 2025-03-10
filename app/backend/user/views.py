from rest_framework import permissions
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from api.pagination import APIPagination
from user.serializers import (
    UserSerializer,
    UsersListSerializer,
    RegisterUserSerializer,
)

User = get_user_model()


class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UsersListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UsersListSerializer
    pagination_class = APIPagination

    def get_queryset(self):
        current_user = self.request.user
        # If not admin, return an empty queryset
        if not current_user.is_admin:
            return User.objects.none()
        return User.objects.filter(
            dru_id=current_user.dru.id,
            is_verified=True,
            is_legacy=False,
        )

    def list(self, request, *args, **kwargs):
        current_user = request.user
        if not current_user.is_admin:
            return Response(
                {
                    "success": False,
                    "message": "You are not authorized to perform this action",
                },
                # status=status.HTTP_403_FORBIDDEN,
            )

        # If admin, proceed with the normal pagination flow
        response = super().list(request, *args, **kwargs)
        # Optionally, you can wrap the data as follows:
        return Response(response.data)


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
