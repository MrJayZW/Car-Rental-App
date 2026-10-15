from datetime import date

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from cars.models import Car
from cars.serializers import CarSerializer
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    car_id = serializers.PrimaryKeyRelatedField(
        queryset=Car.objects.filter(is_available=True),
        source="car",
        write_only=True,
    )

    class Meta:
        model = Booking
        fields = [
            "id", "car", "car_id", "start_date", "end_date",
            "total_price", "status", "created_at",
        ]
        read_only_fields = ["total_price", "status", "created_at"]

    def validate(self, data):
        if data["start_date"] < date.today():
            raise serializers.ValidationError("Start date cannot be in the past.")

        booking = Booking(
            user=self.context["request"].user,
            car=data["car"],
            start_date=data["start_date"],
            end_date=data["end_date"],
        )
        try:
            booking.clean()
        except DjangoValidationError as error:
            raise serializers.ValidationError(error.messages)
        return data