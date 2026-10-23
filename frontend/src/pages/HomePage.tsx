import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCars } from "../api/cars";
import type { Car } from "../types/car";

export default function HomePage() {
    const [featured, setFeatured] = useState<Car[]>([]);

    useEffect(() => {
        fetchCars()
            .then((cars) => {
                const flagship = cars
                    .filter((car) => car.image)
                    .sort((a, b) => Number(b.price_per_day) - Number(a.price_per_day))
                    .slice(0, 3);
                setFeatured(flagship);
            })
            .catch(() => setFeatured([]));
    }, []);

    return (
        <>
            <section className="hero">
                <h1>Drive something unforgettable</h1>
                <p>Choose from our fleet, pick your dates and book in minutes.</p>
                <Link to="/cars" className="hero__button">
                    Browse all cars
                </Link>
            </section>

            {featured.length > 0 && (
                <section>
                    <h2 className="section-title">Featured cars</h2>
                    <div className="showcase">
                        {featured.map((car) => (
                            <Link
                                key={car.id}
                                to={`/cars/${car.id}`}
                                className="showcase__tile"
                            >
                                {car.image && (
                                    <img src={car.image} alt={`${car.brand} ${car.model}`} />
                                )}
                                <div className="showcase__caption">
                                    <span>
                                        {car.brand} {car.model}
                                    </span>
                                    <small>from {car.price_per_day} per day</small>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}