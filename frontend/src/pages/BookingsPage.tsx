import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cancelBooking, fetchMyBookings } from "../api/bookings";
import { useAuth } from "../auth/AuthContext";
import type { Booking } from "../types/booking";

export default function BookingsPage() {
    const { token } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        fetchMyBookings(token)
            .then(setBookings)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    async function handleCancel(id: number) {
        if (!token || !window.confirm("Cancel this booking?")) return;
        setError(null);
        try {
            const updated = await cancelBooking(token, id);
            setBookings((current) => current.map((b) => (b.id === id ? updated : b)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        }
    }

    if (!token) {
        return (
            <p>
                Please <Link to="/login">log in</Link> to see your bookings.
            </p>
        );
    }
    if (loading) return <p>Loading bookings...</p>;

    return (
        <>
            <h1>My bookings</h1>
            {error && <p className="form-error">{error}</p>}

            {bookings.length === 0 && !error ? (
                <p>
                    You have no bookings yet. <Link to="/">Browse cars</Link>
                </p>
            ) : (
                <ul className="booking-list">
                    {bookings.map((booking) => {
                        const canCancel =
                            booking.status === "pending" || booking.status === "approved";
                        return (
                            <li key={booking.id} className="booking-item">
                                {booking.car.image ? (
                                    <img
                                        className="booking-item__image"
                                        src={booking.car.image}
                                        alt={`${booking.car.brand} ${booking.car.model}`}
                                    />
                                ) : (
                                    <div className="booking-item__image" />
                                )}
                                <div className="booking-item__body">
                                    <h2>
                                        <Link to={`/cars/${booking.car.id}`}>
                                            {booking.car.brand} {booking.car.model}
                                        </Link>
                                    </h2>
                                    <p>
                                        {booking.start_date} to {booking.end_date}
                                    </p>
                                    <p>Total: {booking.total_price}</p>
                                </div>
                                <div className="booking-item__side">
                                    <span className={`status status--${booking.status}`}>
                                        {booking.status}
                                    </span>
                                    {canCancel && (
                                        <button
                                            type="button"
                                            className="button-secondary"
                                            onClick={() => handleCancel(booking.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}