import type { Car } from "./car";

export type BookingStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled"
    | "returned";

export interface Booking {
    id: number;
    car: Car;
    start_date: string;
    end_date: string;
    total_price: string;
    status: BookingStatus;
    created_at: string;
}

export interface BookingRequest {
    car_id: number;
    start_date: string;
    end_date: string;
}

export interface BookedRange {
    start_date: string;
    end_date: string;
}