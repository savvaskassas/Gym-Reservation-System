import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Φόρμα σύνδεσης (login) του χρήστη
export default function LoginForm() {
  const [username, setUsername] = useState(""); // username state
  const [password, setPassword] = useState(""); // password state
  const [msg, setMsg] = useState("");           // μήνυμα επιτυχίας/σφάλματος
  const navigate = useNavigate();               // για redirect μετά το login
  const { login } = useAuth();                  // login από το context

  // Υποβολή φόρμας
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Κλήση στο API για login
      const res = await axios.post("/api/users/login", { username, password });
      // Αποθήκευση user + token στο context/localStorage
      login({ ...res.data.user, token: res.data.token });
      setMsg("Επιτυχής σύνδεση!");
      navigate("/"); // Redirect στην αρχική
    } catch (err) {
      setMsg(err.response?.data?.message || "Σφάλμα σύνδεσης.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Όνομα χρήστη:</label>
      <input value={username} onChange={e => setUsername(e.target.value)} required />
      <label>Κωδικός:</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Σύνδεση</button>
      {/* Εμφάνιση μηνύματος */}
      {msg && <div>{msg}</div>}
    </form>
  );
}