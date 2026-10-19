import { API_URL } from "./config";
import type { Booking, BookingRequest } from "../types/booking";

function authHeaders(token: string) {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

async function readError(response: Response, fallback: string): Promise<Error> {
    if (response.status === 401) {
        return new Error("Your session has expired. Please log in again.");
    }
    try {
        const problems = await response.json();
        const first = Object.values(problems).flat()[0];
        return new Error(String(first ?? fallback));
    } catch {
        return new Error(fallback);
    }
}

export async function createBooking(
    token: string,
    data: BookingRequest,
): Promise<Booking> {
    const response = await fetch(`${API_URL}/bookings/`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw await readError(response, "Booking failed.");
    return response.json();
}

export async function fetchMyBookings(token: string): Promise<Booking[]> {
    const response = await fetch(`${API_URL}/bookings/`, {
        headers: authHeaders(token),
    });
    if (!response.ok) throw await readError(response, "Could not load bookings.");
    return response.json();
}

export async function cancelBooking(token: string, id: number): Promise<Booking> {
    const response = await fetch(`${API_URL}/bookings/${id}/cancel/`, {
        method: "POST",
        headers: authHeaders(token),
    });
    if (!response.ok) throw await readError(response, "Could not cancel the booking.");
    return response.json();
}

//Authorization: \Bearer ${token}`**. This is where the wristband comes out. Every request to a protected address carries the token in this header, and Django's JWT check reads it to find out who's asking.