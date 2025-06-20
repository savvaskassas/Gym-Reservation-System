import React, { useEffect, useState } from "react";
import axios from "axios";

// Φόρμα εγγραφής χρήστη με επιλογές χώρας και πόλης από API
export default function RegisterForm() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    address: "",
    email: "",
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Φόρτωση χωρών από API
  useEffect(() => {
    axios.get("/api/countries")
      .then(res => setCountries(res.data))
      .catch(() => setCountries([]));
  }, []);

  // Φόρτωση πόλεων ανά χώρα από API
  useEffect(() => {
    if (form.country) {
      axios.get(`/api/cities?country=${encodeURIComponent(form.country)}`)
        .then(res => setCities(res.data))
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
  }, [form.country]);

  // Διαχείριση αλλαγής πεδίου φόρμας
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "country") setForm(f => ({ ...f, city: "" }));
  };

  // Υποβολή φόρμας εγγραφής
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("/api/users/register", form);
      setMessage("Your application was submitted! Please wait for admin approval.");
      setForm({
        firstName: "",
        lastName: "",
        country: "",
        city: "",
        address: "",
        email: "",
        username: "",
        password: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration error.");
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <h2>User Registration</h2>
        {message && <div style={{ color: "green" }}>{message}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First Name" /><br/>
        <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last Name" /><br/>
        <select name="country" value={form.country} onChange={handleChange} required>
          <option value="">Country</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select><br/>
        <select name="city" value={form.city} onChange={handleChange} required disabled={!form.country}>
          <option value="">City</option>
          {cities.map(city => <option key={city} value={city}>{city}</option>)}
        </select><br/>
        <input name="address" value={form.address} onChange={handleChange} required placeholder="Address" /><br/>
        <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" /><br/>
        <input name="username" value={form.username} onChange={handleChange} required placeholder="Username" /><br/>
        <input name="password" value={form.password} onChange={handleChange} required type="password" placeholder="Password" /><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}