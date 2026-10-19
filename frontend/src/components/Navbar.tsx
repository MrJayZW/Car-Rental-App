import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar__inner">
                <NavLink to="/" className="navbar__brand">
                    Car Rental
                </NavLink>
                <nav className="navbar__links">
                    <NavLink to="/" end>
                        Cars
                    </NavLink>
                    <NavLink to="/bookings">
                        My bookings
                    </NavLink>
                    <NavLink to="/login">
                        Log in
                    </NavLink>
                </nav>
            </div>
        </header>

    );
}