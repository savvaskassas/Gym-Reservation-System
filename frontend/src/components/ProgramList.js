import React, { useState, useEffect } from "react";
import axios from "axios";

// Λίστα με όλα τα διαθέσιμα προγράμματα του γυμναστηρίου
export default function ProgramList() {
  const [programs, setPrograms] = useState([]);

  // Φέρνουμε τα προγράμματα από το API όταν φορτώνει το component
  useEffect(() => {
    axios.get("/api/programs")
      .then(res => setPrograms(res.data))
      .catch(() => setPrograms([]));
  }, []);

  return (
    <div>
      <h2>Διαθέσιμα Προγράμματα</h2>
      {/* Εμφανίζουμε τα στοιχεία κάθε προγράμματος */}
      {programs.map(p => (
        <div key={p._id}>
          <h3>{p.name}</h3>
          <div>Τύπος: {p.type}</div>
          <div>Γυμναστής: {p.trainer?.name || "—"}</div>
        </div>
      ))}
    </div>
  );
}