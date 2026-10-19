import type { Car } from "../types/car";

const API_URL = "http://127.0.0.1:8000/api";

export async function fetchCars(): Promise<Car[]> {
    const response = await fetch(`${API_URL}/cars/`);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}