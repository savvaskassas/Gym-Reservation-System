import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Component για εμφάνιση και διαχείριση κρατήσεων χρήστη
export default function Bookings() {
  const [programs, setPrograms] = useState([]);            // Όλα τα προγράμματα
  const [myBookings, setMyBookings] = useState([]);        // Οι κρατήσεις του χρήστη
  const [selected, setSelected] = useState({ program: "", day: "", time: "", date: "" });
  const [msg, setMsg] = useState("");                      // Μηνύματα επιτυχίας/σφάλματος
  const { user } = useAuth();

  // Φέρνουμε τα προγράμματα και τις κρατήσεις μόλις φορτώσει το component
  useEffect(() => {
    axios.get("/api/programs").then(res => setPrograms(res.data));
    fetchBookings();
  }, []);

  // Φέρνει το ιστορικό κρατήσεων του χρήστη
  const fetchBookings = () => {
    axios.get("/api/bookings/my", { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(res => setMyBookings(res.data));
  };

  // Υποβάλλει νέα κράτηση
  const handleBooking = () => {
    axios.post("/api/bookings", {
      programId: selected.program,
      scheduleDate: selected.date,
      day: selected.day,
      time: selected.time
    }, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }).then(() => {
      setMsg("Κράτηση επιτυχής!");
      fetchBookings();
    }).catch(err => setMsg(err.response?.data?.message || "Σφάλμα κράτησης."));
  };

  // Ακυρώνει κράτηση
  const handleCancel = (id) => {
    axios.patch(`/api/bookings/${id}`, {}, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }).then(() => {
      setMsg("Ακύρωση επιτυχής!");
      fetchBookings();
    }).catch(err => setMsg(err.response?.data?.message || "Σφάλμα ακύρωσης."));
  };

  // Η demo υλοποίηση δεν έχει δυναμικά dropdowns ― προσάρμοσέ το αν θέλεις
  return (
    <div>
      <h2>Νέα Κράτηση</h2>
      <select value={selected.program} onChange={e => setSelected(s => ({ ...s, program: e.target.value }))}>
        <option>Επιλέξτε πρόγραμμα</option>
        {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
      {/* Προσθέστε dropdowns/inputs για day, time, date */}
      <button onClick={handleBooking}>Κάνε Κράτηση</button>
      {msg && <div>{msg}</div>}

      <h2>Οι Κρατήσεις μου</h2>
      {/* Εμφάνιση ιστορικού */}
      {myBookings.map(b => (
        <div key={b._id}>
          Πρόγραμμα: {b.program?.name} | Ημ/νία: {b.schedule?.date?.slice(0, 10)} | Ώρα: {b.schedule?.time} 
          {!b.cancelled && <button onClick={() => handleCancel(b._id)}>Ακύρωση</button>}
          {b.cancelled && <span> (Ακυρωμένη)</span>}
        </div>
      ))}
    </div>
  );
}