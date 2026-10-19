import type { LoginCredentials, RegisterData, TokenPair } from "../types/auth";

const API_URL = "http://127.0.0.1:8000/api";

export async function login(credentials: LoginCredentials): Promise<TokenPair> {
    const response = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error("Wrong username or password.");
    }
    return response.json();
}

export async function register(data: RegisterData): Promise<void> {
    const response = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const problems = await response.json();
        const first = Object.values(problems).flat()[0];
        throw new Error(String(first ?? "Registration failed."));
    }
}