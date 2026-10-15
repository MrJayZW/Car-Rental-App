from rest_framework import viewsets
from .models import Car
from .serializers import CarSerializer
from django.utilis.dateparse import parse_date
from rest_framework.decorators import action
from rest_framework.response import Response

from bookings.models import Booking
from .serializers import CarSerializer

def read_date(text):
    try:
        return parse_date(text or "")
    except ValueError:
        return None

class CarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Car.objects.filter(is_available=True)
    serializer_class = CarSerializer
    filterset_fields = ["transmission", "fuel_type", "seats"]
    search_fields = ["brand", "model"]
    ordering_fields = ["price_per_day", "year"]

    def get_queryset(self):
        queryset = Car.objects.filter(is_available=True)
        start = read_date(self.request.query_params.get("start_date"))
        end = read_date(self.request.query_params.get("end_date"))

        if start and end and start < end:
            taken = Booking.objects.filter(
                status__in=["pending", "approved"],
                start_date__lt=end,
                end_date__gt=start,
            ).values_list("car_id")
            queryset = queryset.exclude(id__in=taken)
        return queryset
    
    @action(detail=True, methods=["get"], url_path="booked-dates")
    def booked_dates(self, request, pk=None):
        car = self.get_object()
        ranges = car.bookings.filter(
            status__in=["pending", "approved"]
        ).values_list("start_date", "end_date")
        return Response(list(ranges))