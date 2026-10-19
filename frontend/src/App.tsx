import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookingsPage from "./pages/BookingsPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;