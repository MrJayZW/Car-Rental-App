import { API_URL } from "./config";
import type { BookedRange } from "../types/booking";
import type { Car } from "../types/car";

export interface CarFilters {
    search?: string;
    transmission?: string;
    fuel_type?: string;
    ordering?: string;
    start_date?: string;
    end_date?: string;
}

export async function fetchCars(filters: CarFilters = {}): Promise<Car[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
    });
    const query = params.toString();
    const response = await fetch(`${API_URL}/cars/${query ? `?${query}` : ""}`);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}

export async function fetchCar(id: string): Promise<Car> {
    const response = await fetch(`${API_URL}/cars/${id}/`);
    if (response.status === 404) {
        throw new Error("This car could not be found.");
    }
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}

export async function fetchBookedDates(id: string): Promise<BookedRange[]> {
    const response = await fetch(`${API_URL}/cars/${id}/booked-dates/`);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}