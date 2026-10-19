import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { fetchCars } from "../api/cars";
import type { CarFilters } from "../api/cars";
import CarCard from "../components/CarCard";
import type { Car } from "../types/car";

const emptyFilters: CarFilters = {
    search: "",
    transmission: "",
    fuel_type: "",
    ordering: "",
    start_date: "",
    end_date: "",
};

export default function HomePage() {
    const [draft, setDraft] = useState<CarFilters>({ ...emptyFilters });
    const [filters, setFilters] = useState<CarFilters>({ ...emptyFilters });
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchCars(filters)
            .then((data) => {
                if (!cancelled) setCars(data);
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [filters]);

    function change(field: keyof CarFilters, value: string) {
        setDraft((current) => ({ ...current, [field]: value }));
    }

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setFilters({ ...draft });
    }

    function handleClear() {
        setLoading(true);
        setError(null);
        setDraft({ ...emptyFilters });
        setFilters({ ...emptyFilters });
    }

    return (
        <>
            <h1>Available cars</h1>

            <form className="filters" onSubmit={handleSubmit}>
                <label>
                    Search
                    <input
                        value={draft.search}
                        onChange={(e) => change("search", e.target.value)}
                        placeholder="Brand or model"
                    />
                </label>

                <label>
                    Transmission
                    <select
                        value={draft.transmission}
                        onChange={(e) => change("transmission", e.target.value)}
                    >
                        <option value="">Any</option>
                        <option value="manual">Manual</option>
                        <option value="automatic">Automatic</option>
                    </select>
                </label>

                <label>
                    Fuel
                    <select
                        value={draft.fuel_type}
                        onChange={(e) => change("fuel_type", e.target.value)}
                    >
                        <option value="">Any</option>
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </label>

                <label>
                    Sort by
                    <select
                        value={draft.ordering}
                        onChange={(e) => change("ordering", e.target.value)}
                    >
                        <option value="">Default</option>
                        <option value="price_per_day">Cheapest first</option>
                        <option value="-price_per_day">Most expensive first</option>
                    </select>
                </label>

                <label>
                    Pick-up
                    <input
                        type="date"
                        value={draft.start_date}
                        onChange={(e) => change("start_date", e.target.value)}
                    />
                </label>

                <label>
                    Return
                    <input
                        type="date"
                        min={draft.start_date}
                        value={draft.end_date}
                        onChange={(e) => change("end_date", e.target.value)}
                    />
                </label>

                <div className="filters__actions">
                    <button type="submit">Search</button>
                    <button type="button" className="button-secondary" onClick={handleClear}>
                        Clear
                    </button>
                </div>
            </form>

            {loading && <p>Loading cars...</p>}
            {error && <p className="form-error">Something went wrong: {error}</p>}
            {!loading && !error && cars.length === 0 && (
                <p>No cars match those filters.</p>
            )}
            {!loading && !error && cars.length > 0 && (
                <div className="car-grid">
                    {cars.map((car) => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            )}
        </>
    );
}