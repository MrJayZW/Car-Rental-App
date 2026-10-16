from django.contrib import admin, messages

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "car", "start_date", "end_date", "total_price", "status")
    list_filter = ("status", "start_date")
    search_fields = ("user__username", "car__brand", "car__model")
    readonly_fields = ("total_price",)
    actions = ["approve", "reject", "mark_returned"]

    @admin.action(description="Approve selected bookings")
    def approve(self, request, queryset):
        count = queryset.filter(status="pending").update(status="approved")
        self.message_user(request, f"{count} booking(s) approved.", messages.SUCCESS)

    @admin.action(description="Reject selected bookings")
    def reject(self, request, queryset):
        count = queryset.filter(status="pending").update(status="rejected")
        self.message_user(request, f"{count} booking(s) rejected.", messages.SUCCESS)

    @admin.action(description="Mark selected bookings as returned")
    def mark_returned(self, request, queryset):
        count = queryset.filter(status="approved").update(status="returned")
        self.message_user(request, f"{count} booking(s) marked as returned.", messages.SUCCESS)