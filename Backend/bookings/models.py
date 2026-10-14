from django.db import models
from django.conf import settings
from cars.models import Car
from django.core.exceptions import ValidationError

class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("cancelled", "Cancelled"),
        ("returned", "Returned"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name="bookings")
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.car} ({self.start_date} to {self.end_date})"

    def clean(self):
        if self.start_date and self.end_date:
            if self.end_date <= self.start_date:
                raise ValidationError("Return date must be after the start date.")

            overlapping = Booking.objects.filter(

                car_id=self.car_id,
                status__in=["pending", "approved"],
                start_date__lt=self.end_date,
                end_date__gt=self.start_date,
            
            ).exclude(pk=self.pk)

            if overlapping.exists():
                raise ValidationError("This car is already booked for the selected dates.")
            

    # Create your models here.
