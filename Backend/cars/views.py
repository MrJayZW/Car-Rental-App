from rest_framework import viewsets
from .models import Car
from .serializers import CarSerializer


class CarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Car.objects.filter(is_available=True)
    serializer_class = CarSerializer
    filterset_fields = ["transmission", "fuel_type", "seats"]
    search_fields = ["brand", "model"]
    ordering_fields = ["price_per_day", "year"]