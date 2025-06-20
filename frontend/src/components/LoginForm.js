import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Φόρμα σύνδεσης (login) του χρήστη
export default function LoginForm() {
  const [username, setUsername] = useState(""); // username state
  const [password, setPassword] = useState(""); // password state
  const [msg, setMsg] = useState(""); // μήνυμα επιτυχίας/σφάλματος
  const [error, setError] = useState(""); // μήνυμα λάθους
  const navigate = useNavigate(); // για redirect μετά το login
  const { login } = useAuth(); // login από το context

  // Υποβολή φόρμας
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      // Κλήση στο API για login
      const res = await axios.post("/api/users/login", { username, password });
      // Αποθήκευση user + token στο context/localStorage
      login({ ...res.data.user, token: res.data.token });
      setMsg("Login successful!");
      navigate("/"); // Redirect στην αρχική
    } catch (err) {
      setError(err.response?.data?.message || "Login error.");
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        {/* Εμφάνιση μηνύματος */}
        {msg && <div style={{ color: "green" }}>{msg}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}