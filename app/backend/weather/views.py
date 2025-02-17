from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from weather.models import Weather
from weather.serializer import WeatherSerializer

class WeatherView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = WeatherSerializer

    def get(self, request):
        queryset = Weather.objects.all()
        serializer = WeatherSerializer(queryset, many=True)
        return Response(serializer.data)