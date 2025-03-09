from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import permissions
from dru.serializer import RegisterDRUSerializer


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

        curr_user_dru_type = current_user.dru.dru_type
        ALLOWED_DRU_TYPES = ["National", "RESU", "PESU/CESU"]
        if curr_user_dru_type not in ALLOWED_DRU_TYPES:
            return JsonResponse(
                {
                    "success": False,
                    "message": "You are not authorized to perform this action",
                }
            )

        # Create DRU
        serializer = RegisterDRUSerializer(data=request.data)
