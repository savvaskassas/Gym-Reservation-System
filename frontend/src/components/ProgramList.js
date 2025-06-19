import React, { useState, useEffect } from "react";
import axios from "axios";

// Λίστα με όλα τα διαθέσιμα προγράμματα του γυμναστηρίου (public)
export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(""); // Λάθη από API

  // Φέρνουμε τα προγράμματα από το API όταν φορτώσει το component
  useEffect(() => {
    axios.get("/api/programs")
      .then(res => setPrograms(res.data))
      .catch(() => {
        setPrograms([]);
        setError("Could not fetch programs.");
      });
  }, []);

  return (
    <div>
      <h2>Available Programs</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {/* Εμφανίζουμε τα στοιχεία κάθε προγράμματος */}
      {programs.length === 0 && <div>No programs available.</div>}
      {programs.map(p => (
        <div key={p._id}>
          <h3>{p.name}</h3>
          <div>Type: {p.type}</div>
          <div>Trainer: {p.trainer?.name || "—"}</div>
        </div>
      ))}
    </div>
  );
}