import { useEffect, useState } from "react";
import { fetchCars } from "../api/cars";
import CarCard from "../components/CarCard";
import type { Car } from "../types/car";

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCars()
            .then(setCars)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading cars...</p>;
    if (error) return <p>Something went wrong: {error}</p>;

    return (
        <>
            <h1>Available cars</h1>
            <div className="car-grid">
                {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
        </>
    );
}