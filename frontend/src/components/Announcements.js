import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Component για προβολή όλων των ανακοινώσεων στο authenticated χρήστη
export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const { user } = useAuth();

  // Φόρτωση ανακοινώσεων από το API (χρειάζεται token)
  useEffect(() => {
    axios.get("/api/announcements", {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
      .then(res => setAnnouncements(res.data));
  }, [user]);

  return (
    <div>
      <h2>Ανακοινώσεις</h2>
      {/* Εμφάνιση κάθε ανακοίνωσης */}
      {announcements.map(a => (
        <div key={a._id}>
          <h3>{a.title}</h3>
          <div>{a.content}</div>
          <small>{a.date?.slice(0, 10)}</small>
        </div>
      ))}
    </div>
  );
}