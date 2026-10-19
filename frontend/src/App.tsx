import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookingsPage from "./pages/BookingsPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import LoginPage from "./pages/LoginPage";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;