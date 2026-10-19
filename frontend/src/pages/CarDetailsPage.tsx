import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createBooking } from "../api/bookings";
import { fetchBookedDates, fetchCar } from "../api/cars";
import { useAuth } from "../auth/AuthContext";
import type { BookedRange } from "../types/booking";
import type { Car } from "../types/car";

function daysBetween(start: string, end: string): number {
    if (!start || !end) return 0;
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return Math.round(ms / 86400000);
}

export default function CarDetailsPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [car, setCar] = useState<Car | null>(null);
    const [booked, setBooked] = useState<BookedRange[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([fetchCar(id), fetchBookedDates(id)])
            .then(([carData, ranges]) => {
                setCar(carData);
                setBooked(ranges);
            })
            .catch((err: Error) => setLoadError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!car || !token) return;
        setFormError(null);
        setSubmitting(true);
        try {
            await createBooking(token, {
                car_id: car.id,
                start_date: startDate,
                end_date: endDate,
            });
            navigate("/bookings");
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <p>Loading car...</p>;
    if (loadError) return <p>Something went wrong: {loadError}</p>;
    if (!car) return <p>Car not found.</p>;

    const days = daysBetween(startDate, endDate);
    const estimate = days > 0 ? (days * Number(car.price_per_day)).toFixed(2) : null;
    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className="details">
            {car.image ? (
                <img
                    className="details__image"
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                />
            ) : (
                <div className="details__image details__image--empty">No photo</div>
            )}

            <div className="details__info">
                <h1>
                    {car.brand} {car.model}
                </h1>
                <p className="car-card__meta">
                    {car.year} · {car.transmission} · {car.fuel_type} · {car.seats} seats
                </p>
                {car.description && <p>{car.description}</p>}
                <p className="car-card__price">
                    {car.price_per_day} <span>per day</span>
                </p>

                <h2>Already booked</h2>
                {booked.length === 0 ? (
                    <p>No bookings yet. Every date is free.</p>
                ) : (
                    <ul className="booked-list">
                        {booked.map((range, index) => (
                            <li key={index}>
                                {range.start_date} to {range.end_date}
                            </li>
                        ))}
                    </ul>
                )}

                <h2>Book this car</h2>
                {token ? (
                    <form className="booking-form" onSubmit={handleSubmit}>
                        <label htmlFor="start">Pick-up date</label>
                        <input
                            id="start"
                            type="date"
                            min={today}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />

                        <label htmlFor="end">Return date</label>
                        <input
                            id="end"
                            type="date"
                            min={startDate || today}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />

                        {estimate && (
                            <p className="booking-form__estimate">
                                {days} day(s), about {estimate} in total. The final price is
                                calculated by the server.
                            </p>
                        )}

                        {formError && <p className="form-error">{formError}</p>}

                        <button type="submit" disabled={submitting}>
                            {submitting ? "Booking..." : "Book now"}
                        </button>
                    </form>
                ) : (
                    <p>
                        <Link to="/login">Log in</Link> or <Link to="/register">register</Link>{" "}
                        to book this car.
                    </p>
                )}
            </div>
        </div>
    );
}