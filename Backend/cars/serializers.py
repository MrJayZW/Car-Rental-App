from rest_framework import serializers
from.models import Car

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = [
            "id", "brand", "model", "year", "price_per_day",
            "transmission", "fuel_type", "seats", "description", "image",
        ]