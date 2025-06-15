import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RegisterForm() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Φέρνουμε τις χώρες με το που φορτώνει το component
  useEffect(() => {
    axios.get("/api/countries")
      .then(res => setCountries(res.data))
      .catch(() => setCountries([]));
  }, []);

  // Φέρνουμε τις πόλεις όταν αλλάξει η χώρα
  useEffect(() => {
    if (selectedCountry) {
      axios.get(`/api/cities?country=${encodeURIComponent(selectedCountry)}`)
        .then(res => setCities(res.data))
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  // Submit handler 
  const handleSubmit = (e) => {
    e.preventDefault();
    // Εδώ βάλε τη λογική εγγραφής σου
    alert(`Χώρα: ${selectedCountry}, Πόλη: ${selectedCity}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* --- Άλλα πεδία εγγραφής εδώ --- */}

      <label>Χώρα:</label>
      <select
        value={selectedCountry}
        onChange={e => {
          setSelectedCountry(e.target.value);
          setSelectedCity("");
        }}
        required
      >
        <option value="">Επιλέξτε χώρα</option>
        {countries.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label>Πόλη:</label>
      <select
        value={selectedCity}
        onChange={e => setSelectedCity(e.target.value)}
        disabled={!selectedCountry}
        required
      >
        <option value="">Επιλέξτε πόλη</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      <button type="submit">Εγγραφή</button>
    </form>
  );
}