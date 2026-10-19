import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextValue {
    token: string | null;
    saveToken: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        const stored = localStorage.getItem("access_token");
        if (stored && isExpired(stored)) {
            localStorage.removeItem("access_token");
            return null;
        }
        return stored;
    });

    function saveToken(newToken: string) {
        localStorage.setItem("access_token", newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem("access_token");
        setToken(null);
    }
    //CONTEXT, thelocalstorage is used to persist the token across page reloads, and the context provides a way to access the token and authentication functions throughout the application.
    return (
        <AuthContext.Provider value={{ token, saveToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

function isExpired(token: string): boolean {
    try {
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const { exp } = JSON.parse(atob(payload)) as { exp: number };
        return exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return value;
}