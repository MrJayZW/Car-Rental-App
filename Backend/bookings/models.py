from django.db import models
from django.conf import settings
from cars.models import Car

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
status = models.CharField
created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
    return f"{self.user} - {self.car} ({self.start_date} to {self.end_date})"
# Create your models here.
