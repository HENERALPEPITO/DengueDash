from rest_framework import permissions
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.token_blacklist.models import (
    OutstandingToken,
    BlacklistedToken,
)
from rest_framework import status
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from api.pagination import APIPagination
from user.serializers import (
    UserFullInfoSerializer,
    UsersListSerializer,
    UsersUnverifiedListSerializer,
    RegisterUserSerializer,
    BlacklistedUsersSerializer,
    PasswordUpdateSerializer,
)
from auth.permission import IsUserAdmin
from user.models import BlacklistedUsers

User = get_user_model()


class MyUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserFullInfoSerializer(request.user)
        return Response(serializer.data)


class PasswordUpdateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request):
        serializer = PasswordUpdateSerializer(
            data=request.data, context={"request": request}
        )
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Password updated successfully",
                    }
                )
        except ValidationError as e:
            error_message = "Validation failed."

            if isinstance(e.detail, dict):
                first_field = list(e.detail.keys())[0] if e.detail else None
                if (
                    first_field
                    and isinstance(e.detail[first_field], list)
                    and e.detail[first_field]
                ):
                    error_message = str(e.detail[first_field][0])
                else:
                    error_message = str(e.detail)
            else:
                error_message = str(e.detail)

            return JsonResponse(
                {
                    "success": False,
                    "message": f"Password update failed: {error_message}",
                },
            )
        except Exception as e:
            return JsonResponse(
                {
                    "success": False,
                    "message": f"An unexpected error occurred: {str(e)}",
                },
            )


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

        serializer = UserFullInfoSerializer(user)
        return Response(serializer.data)


class BaseUserListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated, IsUserAdmin)
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
        email = request.data.get("email")
        is_user_blacklisted = BlacklistedUsers.objects.filter(email=email).exists()
        if is_user_blacklisted:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User is blacklisted. Cannot register account.",
                },
            )

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


class VerifiyUserView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsUserAdmin)

    def patch(self, request, user_id):
        current_user = request.user
        user_to_find = User.objects.filter(id=user_id).first()
        if user_to_find is None:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        if user_to_find.dru_id != current_user.dru.id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You are not allowed to perform this action",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        user_to_find.is_verified = True
        user_to_find.save()
        return JsonResponse(
            {
                "success": True,
                "message": "User verified successfully",
            }
        )


class ToggleUserRoleView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsUserAdmin)

    def patch(self, request, user_id):
        current_user = request.user
        user_to_find = User.objects.filter(id=user_id).first()
        if user_to_find is None:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        if user_to_find.dru_id != current_user.dru.id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You are not allowed to perform this action",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        user_to_find.is_admin = not user_to_find.is_admin
        user_to_find.save()
        return JsonResponse(
            {
                "success": True,
                "message": "User role updated successfully",
            }
        )


class DeleteUserView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsUserAdmin)

    def revoke_tokens(self, user):
        try:
            outstanding_tokens = OutstandingToken.objects.filter(
                user=user,
            )

            for token in outstanding_tokens:
                BlacklistedToken.objects.create(
                    token=token,
                )

        except Exception as e:
            return JsonResponse(
                {
                    "success": False,
                    "message": f"An error occurred while revoking tokens: {str(e)}",
                },
            )

        return None

    def delete(self, request, user_id):
        current_user = request.user

        if not current_user.is_admin:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You are not authorized to perform this action",
                }
            )

        user_to_delete = User.objects.filter(id=user_id).first()
        if user_to_delete is None:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User not found",
                },
            )
        if user_to_delete.dru_id != current_user.dru.id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You are not allowed to perform this action",
                },
            )

        # Blacklist the user before deleting
        revoke_reponse = self.revoke_tokens(user_to_delete)
        if revoke_reponse:
            return revoke_reponse
        BlacklistedUsers.objects.create(
            email=user_to_delete.email,
            dru=user_to_delete.dru,
        )
        user_to_delete.delete()

        return JsonResponse(
            {
                "success": True,
                "message": "User deleted successfully",
            }
        )


class BlacklistedUsersListView(BaseUserListView):
    serializer_class = BlacklistedUsersSerializer

    def get_queryset(self):
        current_user = self.request.user
        return BlacklistedUsers.objects.filter(
            dru_id=current_user.dru.id,
        )


class UnbanUserView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsUserAdmin)

    def delete(self, request, user_id):
        current_user = request.user
        id_to_find = BlacklistedUsers.objects.filter(id=user_id).first()
        if id_to_find is None:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Blacklisted account not found",
                },
            )
        if id_to_find.dru_id != current_user.dru.id:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You are not allowed to perform this action",
                },
            )

        id_to_find.delete()
        return JsonResponse(
            {
                "success": True,
                "message": "User unbanned successfully",
            }
        )
