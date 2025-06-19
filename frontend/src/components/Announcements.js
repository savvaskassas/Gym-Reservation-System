import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Εμφάνιση ανακοινώσεων μόνο σε authenticated χρήστες
export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(""); // Μήνυμα λάθους
  const { user } = useAuth();

  // Φόρτωση ανακοινώσεων από το API (απαιτείται token)
  useEffect(() => {
    if (!user?.token) {
      setAnnouncements([]);
      setError("You must be logged in to see announcements.");
      return;
    }
    axios.get("/api/announcements", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => {
        setAnnouncements(res.data);
        setError("");
      })
      .catch(() => setError("Could not fetch announcements."));
  }, [user]);

  return (
    <div>
      <h2>Announcements</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {/* Εμφάνιση κάθε ανακοίνωσης */}
      {announcements.length === 0 && !error && <div>No announcements found.</div>}
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