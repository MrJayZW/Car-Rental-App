import { API_URL } from "./config";
import type { Booking, BookingRequest } from "../types/booking";

export async function createBooking(
    token: string,
    data: BookingRequest,
): Promise<Booking> {
    const response = await fetch(`${API_URL}/bookings/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
    }
    if (!response.ok) {
        const problems = await response.json();
        const first = Object.values(problems).flat()[0];
        throw new Error(String(first ?? "Booking failed."));
    }
    return response.json();
}

//Authorization: \Bearer ${token}`**. This is where the wristband comes out. Every request to a protected address carries the token in this header, and Django's JWT check reads it to find out who's asking.