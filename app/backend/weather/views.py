from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from weather.models import Weather
from weather.serializer import WeatherSerializer
from django.db.models import Q


class WeatherView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = WeatherSerializer

    def filter_by_date(self, request, data):
        if request.query_params.get("year") and request.query_params.get("week"):

            return data.filter(
                Q(
                    start_day__year=request.query_params.get("year"),
                    start_day__week=request.query_params.get("week"),
                ),
            )
        return data

    def get(self, request):
        weather = Weather.objects.all()
        weather = self.filter_by_date(request, weather)
        serializer = WeatherSerializer(weather, many=True)
        return Response(serializer.data)
