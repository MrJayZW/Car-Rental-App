import { useEffect, useState } from "react";
import { fetchCars } from "./api/cars";
import type { Car } from "./types/car";

function App() {
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
    <main>
      <h1>Car Rental</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.brand} {car.model} ({car.year}), {car.price_per_day} per day
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;