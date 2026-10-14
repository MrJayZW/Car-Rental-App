from datetime import date, timedelta

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.test import TestCase

from cars.models import Car
from .models import Booking


class BookingTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="pass12345")
        self.car = Car.objects.create(
            brand="Toyota", model="Corolla", year=2022, price_per_day=45,
            transmission="automatic", fuel_type="petrol", seats=5,
        )
        self.today = date.today()

    def make_booking(self, start, end, car=None):
        booking = Booking(
            user=self.user,
            car=car or self.car,
            start_date=self.today + timedelta(days=start),
            end_date=self.today + timedelta(days=end),
        )
        booking.full_clean(exclude=["total_price"])
        booking.save()
        return booking

    def test_price_is_days_times_daily_rate(self):
        booking = self.make_booking(1, 4)
        self.assertEqual(booking.total_price, 135)

    def test_overlapping_booking_is_rejected(self):
        self.make_booking(1, 5)
        with self.assertRaises(ValidationError):
            self.make_booking(3, 7)

    def test_back_to_back_booking_is_allowed(self):
        self.make_booking(1, 5)
        self.make_booking(5, 8)

    def test_return_before_start_is_rejected(self):
        with self.assertRaises(ValidationError):
            self.make_booking(5, 3)

    def test_cancelled_booking_frees_the_dates(self):
        booking = self.make_booking(1, 5)
        booking.status = "cancelled"
        booking.save()
        self.make_booking(1, 5)