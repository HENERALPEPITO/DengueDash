from django.urls import path
from .views import LstmPredictionView

urlpatterns = [
    path("predict/", LstmPredictionView.as_view(), name="lstm-predict"),
]
