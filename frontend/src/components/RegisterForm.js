import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    axios.get("/api/countries")
      .then(res => setCountries(res.data))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (form.country) {
      axios.get(`/api/cities?country=${encodeURIComponent(form.country)}`)
        .then(res => setCities(res.data))
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
  }, [form.country]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "country") setForm(f => ({ ...f, city: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("/api/users/register", form);
      setMessage("Η αίτησή σας υποβλήθηκε! Περιμένετε έγκριση από διαχειριστή.");
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
      setError(err.response?.data?.message || "Σφάλμα υποβολής.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Εγγραφή Χρήστη</h2>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Όνομα" /><br/>
      <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Επώνυμο" /><br/>
      <select name="country" value={form.country} onChange={handleChange} required>
        <option value="">Χώρα</option>
        {countries.map(c => <option key={c} value={c}>{c}</option>)}
      </select><br/>
      <select name="city" value={form.city} onChange={handleChange} required disabled={!form.country}>
        <option value="">Πόλη</option>
        {cities.map(city => <option key={city} value={city}>{city}</option>)}
      </select><br/>
      <input name="address" value={form.address} onChange={handleChange} required placeholder="Διεύθυνση" /><br/>
      <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" /><br/>
      <input name="username" value={form.username} onChange={handleChange} required placeholder="Όνομα χρήστη" /><br/>
      <input name="password" value={form.password} onChange={handleChange} required type="password" placeholder="Κωδικός" /><br/>
      <button type="submit">Εγγραφή</button>
    </form>
  );
}