import { API_URL } from "./config";
import type { BookedRange } from "../types/booking";
import type { Car } from "../types/car";

export async function fetchCars(): Promise<Car[]> {
    const response = await fetch(`${API_URL}/cars/`);
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