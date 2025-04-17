from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from case.serializers.case_create_serializer import CaseSerializer


class PatientCaseView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user_id = request.user.id

        # Insert interviewer id to the data
        request.data["interviewer"] = user_id

        serializer = CaseSerializer(
            data=request.data,
        )

        try:
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Case created successfully.",
                    }
                )

        except Exception as e:
            return JsonResponse(
                {
                    "success": False,
                    "message": str(e),
                },
            )

        # Still errors but not validation errors
        # Built-in error handling from the defined structure from the model
        return JsonResponse(
            {
                "success": False,
                "message": serializer.errors,
            },
        )
