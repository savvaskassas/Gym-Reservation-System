import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ProgramList from "./components/ProgramList";
import Bookings from "./components/Bookings";
import Announcements from "./components/Announcements";
import AdminPanel from "./components/AdminPanel";
import { useAuth } from "./hooks/useAuth";

// Βασικό component με navigation και routing για όλο το frontend
function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <nav>
        {/* Συνδέσμοι πλοήγησης, αλλάζει ανάλογα με το αν είναι authenticated και αν είναι admin */}
        <Link to="/">Programs</Link>{" | "}
        {user ? (
          <>
            <Link to="/bookings">Bookings</Link>{" | "}
            <Link to="/announcements">Announcements</Link>{" | "}
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            {" | "}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>{" | "}
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<ProgramList />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/bookings" element={user ? <Bookings /> : <Navigate to="/login" />} />
        <Route path="/announcements" element={user ? <Announcements /> : <Navigate to="/login" />} />
        <Route path="/admin/*" element={user && user.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;