from django.http import JsonResponse
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from dru.serializer import RegisterDRUSerializer

User = get_user_model()
class RegisterDRUView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        current_user = request.user
        if not current_user.is_admin:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You are not authorized to perform this action",
                }
            )
        
        is_superuser = current_user.is_superuser
        if not is_superuser:
            current_user_dru_type = current_user.dru.dru_type
            ALLOWED_DRU_TYPES = ["National", "RESU", "PESU/CESU"]
            if current_user_dru_type not in ALLOWED_DRU_TYPES:
                return JsonResponse(
                    {
                        "success": False,
                        "message": "You are not authorized to perform this action",
                    },
                    status = status.HTTP_403_FORBIDDEN,
                )

        # Create DRU
        serializer = RegisterDRUSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    new_dru = serializer.save()
                    User.objects.create_user(
                        email=new_dru.email,
                        # Todo: change password to a random password
                        password="testpassword",
                        first_name=new_dru.dru_name,
                        middle_name="",
                        last_name="",
                        sex="N/A",
                        is_admin=True,
                        is_verified=True,
                        dru=new_dru,
                    )
            except Exception as e:
                return JsonResponse(
                    {
                        "success" : False,
                        "message" : f"User creation failed: {str(e)}"

                    },
                    status = status.HTTP_400_BAD_REQUEST
                )

            return JsonResponse(
                {
                    "success": True,
                    "message": "DRU successfully registered",
                },
                status=status.HTTP_201_CREATED,
            )

        return JsonResponse(
            {
                "success": False,
                "message": serializer.errors,
            },
            status = status.HTTP_400_BAD_REQUEST,
        )
