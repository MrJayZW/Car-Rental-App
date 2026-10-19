import type { Car } from "../types/car";
import { Link } from "react-router-dom";

interface CarCardProps {
    car: Car;
}

export default function CarCard({ car }: CarCardProps) {
    return (
        <Link to={`/cars/${car.id}`} className="car-card__link">
            <article className="car-card">
                {car.image ? (
                    <img
                        className="car-card__image"
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                    />
                ) : (
                    <div className="car-card__image car-card__image--empty">No photo</div>
                )}
                <div className="car-card__body">
                    <h2>
                        {car.brand} {car.model}
                    </h2>
                    <p className="car-card__meta">
                        {car.year} · {car.transmission} · {car.fuel_type} · {car.seats} seats
                    </p>
                    <p className="car-card__price">
                        {car.price_per_day} <span>per day</span>
                    </p>
                </div>
            </article>
        </Link>
    );
}