import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header className="navbar">
            <div className="navbar__inner">
                <NavLink to="/" className="navbar__brand">
                    Car Rental
                </NavLink>
                <nav className="navbar__links">
                    <NavLink to="/" end>
                        Home
                    </NavLink>
                    <NavLink to="/cars">Cars</NavLink>
                    {token ? (
                        <>
                            <NavLink to="/bookings">My bookings</NavLink>
                            <button type="button" onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Log in</NavLink>
                            <NavLink to="/register">Register</NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}