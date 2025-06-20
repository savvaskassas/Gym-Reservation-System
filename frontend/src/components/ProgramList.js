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
      {programs.length === 0 && <div>No programs available.</div>}
      {programs.map(p => (
        <div key={p._id} style={{ marginBottom: "2em", borderBottom: "1px solid #eee" }}>
          <h3>{p.name}</h3>
          <div>Type: {p.type}</div>
          {/* Trainer σε επίπεδο προγράμματος δεν υπάρχει! */}
          <div>
            <b>Slots:</b>
            {(!p.schedule || p.schedule.length === 0) ? (
              <div style={{ fontStyle: "italic" }}>No slots for this program.</div>
            ) : (
              <ul>
                {p.schedule.map(slot => (
                  <li key={slot._id || (slot.day + slot.time)}>
                    <b>{slot.day}</b> | {slot.time}
                    {" | Trainer: "}
                    {slot.trainer?.name || "—"}
                    {" | Capacity: "}
                    {slot.maxCapacity}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}