import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Εμφάνιση και διαχείριση κρατήσεων χρήστη
export default function Bookings() {
  const [programs, setPrograms] = useState([]); // Όλα τα προγράμματα
  const [slots, setSlots] = useState([]); // Όλα τα slots του τρέχοντος προγράμματος
  const [myBookings, setMyBookings] = useState([]); // Οι κρατήσεις του χρήστη
  const [selected, setSelected] = useState({ program: "", slot: "", date: "" });
  const [msg, setMsg] = useState(""); // Μηνύματα επιτυχίας/σφάλματος
  const [error, setError] = useState(""); // Μήνυμα λάθους
  const { user } = useAuth();

  // Φέρνουμε τα προγράμματα και τις κρατήσεις μόλις φορτώσει το component
  useEffect(() => {
    axios.get("/api/programs")
      .then(res => setPrograms(res.data))
      .catch(() => setPrograms([]));
    fetchBookings();
  }, []);

  // Φέρνει το ιστορικό κρατήσεων του χρήστη
  const fetchBookings = () => {
    axios.get("/api/bookings/my", { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(res => setMyBookings(res.data))
      .catch(() => setMyBookings([]));
  };

  // Όταν αλλάξει πρόγραμμα, φέρνουμε τα slots του
  useEffect(() => {
    if (selected.program) {
      axios.get(`/api/programs/${selected.program}`)
        .then(res => setSlots(res.data.schedule || []))
        .catch(() => setSlots([]));
    } else {
      setSlots([]);
    }
    // Καθαρίζουμε το slot αν αλλάξει πρόγραμμα
    setSelected(s => ({ ...s, slot: "" }));
  }, [selected.program]);

  // Υποβάλλει νέα κράτηση
  const handleBooking = () => {
    setMsg("");
    setError("");
    if (!selected.program || !selected.slot || !selected.date) {
      setError("Please select program, date, and slot.");
      return;
    }
    // Βρίσκουμε το slot για να πάρουμε ώρα/μέρα
    const slotObj = slots.find(s => s._id === selected.slot);
    if (!slotObj) {
      setError("Invalid slot selection.");
      return;
    }
    axios.post("/api/bookings", {
      programId: selected.program,
      scheduleDate: selected.date,
      day: slotObj.day,
      time: slotObj.time,
      slotId: selected.slot
    }, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }).then(() => {
      setMsg("Booking successful!");
      fetchBookings();
    }).catch(err => setError(err.response?.data?.message || "Booking error."));
  };

  // Ακυρώνει κράτηση
  const handleCancel = (id) => {
    setMsg("");
    setError("");
    axios.patch(`/api/bookings/${id}`, {}, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }).then(() => {
      setMsg("Booking cancelled!");
      fetchBookings();
    }).catch(err => setError(err.response?.data?.message || "Cancellation error."));
  };

  return (
    <div>
      <h2>New Booking</h2>
      {/* Επιλογή προγράμματος */}
      <select
        value={selected.program}
        onChange={e => setSelected(s => ({ ...s, program: e.target.value }))}
      >
        <option value="">Select program</option>
        {programs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
      {/* Επιλογή slot αν έχει επιλεγεί πρόγραμμα */}
      <select
        value={selected.slot}
        onChange={e => setSelected(s => ({ ...s, slot: e.target.value }))}
        disabled={!selected.program}
      >
        <option value="">Select slot</option>
        {slots.map(s =>
          <option key={s._id} value={s._id}>
            {s.day} | {s.time} | Trainer: {s.trainer?.name || s.trainer} | Capacity: {s.maxCapacity}
          </option>
        )}
      </select>
      {/* Επιλογή ημερομηνίας */}
      <input
        type="date"
        value={selected.date}
        onChange={e => setSelected(s => ({ ...s, date: e.target.value }))}
        disabled={!selected.slot}
      />
      <button onClick={handleBooking}>Book</button>
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <h2>My Bookings</h2>
      {/* Εμφάνιση ιστορικού */}
      {myBookings.length === 0 && <div>No bookings found.</div>}
      {myBookings.map(b => (
        <div key={b._id}>
          Program: {b.program?.name} | Date: {b.schedule?.date?.slice(0, 10)} | Time: {b.schedule?.time}
          {!b.cancelled && <button onClick={() => handleCancel(b._id)}>Cancel</button>}
          {b.cancelled && <span> (Cancelled)</span>}
        </div>
      ))}
      {/* Προαιρετικά: εμφάνιση προειδοποίησης αν ο χρήστης έχει 2 ακυρώσεις στην εβδομάδα */}
    </div>
  );
}