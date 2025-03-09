from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from user.serializers import (
    UserSerializer,
)
from dru.models import DRU

class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

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