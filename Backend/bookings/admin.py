from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
        list_display = ("id", "user", "car", "start_date", "end_date", "total_price", "status")
        list_filter = ("status",)
        readonly_fields = ("total_price",)
# Register your models here.
