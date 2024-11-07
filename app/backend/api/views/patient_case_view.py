from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from case.serializers.case_create_serializer import CaseSerializer


class PatientCaseView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = CaseSerializer(
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
