from django.db import models

# Create your models here.

class Car (models.Model):
    TRANSMISSION_CHOICES = [
        ("manual", "Manual"),
        ("automatic", "Automatic"),
    ]

    FUEL_CHOICES = [
        ("benzyne","Benzyne"),
        ("gas","Gas"),
        ("diesel","Diesel"),
        ("electric","Electric"),
        ("hybrid","Hybrid")
    ]
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    transmission = models.CharField(max_length= 10, choices=TRANSMISSION_CHOICES)
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES)
    seats = models.PositiveIntegerField(default=5)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="cars/", blank=True, null=True)
    is_available = models.BooleanField(default=True)

    

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"