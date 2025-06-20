import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Helper: Βρες την επόμενη ημερομηνία που αντιστοιχεί σε dayOfWeek (Monday, Tuesday, Δευτέρα κλπ)
function getNextDateOfWeek(dayOfWeek) {
  const daysMap = {
    "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
    "Thursday": 4, "Friday": 5, "Saturday": 6,
    "Κυριακή": 0, "Δευτέρα": 1, "Τρίτη": 2, "Τετάρτη": 3,
    "Πέμπτη": 4, "Παρασκευή": 5, "Σάββατο": 6
  };
  const today = new Date();
  const todayDay = today.getDay(); // 0: Κυριακή, 1: Δευτέρα, ..., 6: Σάββατο
  const targetDay = daysMap[dayOfWeek];
  if (targetDay === undefined) return null;
  let daysToAdd = (targetDay - todayDay + 7) % 7;
  if (daysToAdd === 0) daysToAdd = 7;
  const nextDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd);
  return nextDate.toISOString().slice(0, 10);
}

export default function Bookings() {
  const [programs, setPrograms] = useState([]);
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selected, setSelected] = useState({ program: "", slot: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    axios.get("/api/programs")
      .then(res => setPrograms(res.data))
      .catch(() => setPrograms([]));
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = () => {
    axios.get("/api/bookings/my", { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(res => setMyBookings(res.data))
      .catch(() => setMyBookings([]));
  };

  useEffect(() => {
    if (selected.program) {
      axios.get(`/api/programs/${selected.program}`)
        .then(res => setSlots(res.data.schedule || []))
        .catch(() => setSlots([]));
    } else {
      setSlots([]);
    }
    setSelected(s => ({ ...s, slot: "" }));
    // eslint-disable-next-line
  }, [selected.program]);

  const handleBooking = () => {
    setMsg("");
    setError("");
    if (!selected.program || !selected.slot) {
      setError("Please select program and slot.");
      return;
    }
    const slotObj = slots.find(s => s._id === selected.slot);
    if (!slotObj) {
      setError("Invalid slot selection.");
      return;
    }
    const nextDate = getNextDateOfWeek(slotObj.day);
    if (!nextDate) {
      setError("Could not determine next date for this slot.");
      return;
    }
    axios.post("/api/bookings", {
      programId: selected.program,
      scheduleDate: nextDate,
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
      {/* Δεν υπάρχει input ημερομηνίας */}
      <button onClick={handleBooking}>Book</button>
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <h2>My Bookings</h2>
      {myBookings.length === 0 && <div>No bookings found.</div>}
      {myBookings.map(b => (
        <div key={b._id}>
          Program: {b.program?.name} | Date: {b.schedule?.date?.slice(0, 10)} | Time: {b.schedule?.time}
          {!b.cancelled && <button onClick={() => handleCancel(b._id)}>Cancel</button>}
          {b.cancelled && <span> (Cancelled)</span>}
        </div>
      ))}
    </div>
  );
}