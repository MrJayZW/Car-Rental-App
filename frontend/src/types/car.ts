export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    price_per_day: string;
    transmission: "manual" | "automatic";
    fuel_type: "petrol" | "diesel" | "electric" | "hybrid";
    seats: number;
    description: string;
    image: string | null;
}

//Price per day is a string because it can contain currency symbols and formatting like decimals
