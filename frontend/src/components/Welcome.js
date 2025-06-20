import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Χρησιμοποιούμε το authentication context

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Παίρνουμε τον συνδεδεμένο χρήστη (αν υπάρχει)

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "3.5rem"
    }}>
      <div className="card" style={{ maxWidth: 420, textAlign: "center" }}>
        {/* Αν έχει γίνει login, δείξε προσωποποιημένο welcome */}
        {user ? (
          <>
            <h2 style={{ color: "#232f3e" }}>Welcome, {user.username}!</h2>
            <p className="mt-1 mb-2">
              You are now logged in.<br />
              You can view our programs, book a reservation, and check your announcements and bookings.
            </p>
            {/* Εμφάνιση μόνο σχετικών κουμπιών */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1em", marginTop: 30 }}>
              <button className="btn" onClick={() => navigate("/programs")}>Programs</button>
              <button className="btn" onClick={() => navigate("/bookings")}>My Bookings</button>
              <button className="btn" onClick={() => navigate("/announcements")}>Announcements</button>
              {/* Αν είναι admin, πρόσθεσε shortcut για admin panel */}
              {user.role === "admin" && (
                <button className="btn" onClick={() => navigate("/admin")}>Admin Panel</button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Default welcome screen για μη συνδεδεμένους */}
            <h2 style={{ color: "#232f3e" }}>Welcome to the Gym Management Platform!</h2>
            <p className="mt-1 mb-2">
              Here you can view our programs, book a reservation, manage your account, or register as a new user.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1em", marginTop: 30 }}>
              <button className="btn" onClick={() => navigate("/programs")}>Programs</button>
              <button className="btn" onClick={() => navigate("/login")}>Login</button>
              <button className="btn" onClick={() => navigate("/register")}>Register</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}