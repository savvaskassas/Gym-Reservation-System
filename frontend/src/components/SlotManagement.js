import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Διαχείριση slots για συγκεκριμένο πρόγραμμα
export default function SlotManagement({ programId }) {
  const [program, setProgram] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState({ day: "", time: "", trainer: "", maxCapacity: "" });
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  // Φόρτωση προγράμματος και γυμναστών κατά το mount ή αλλαγή προγράμματος
  useEffect(() => {
    fetchProgram();
    axios.get("/api/trainers").then(res => setTrainers(res.data));
  }, [programId]);

  // Λήψη στοιχείων προγράμματος
  const fetchProgram = () => {
    axios.get(`/api/programs/${programId}`).then(res => setProgram(res.data));
  };

  // Υποβολή νέου slot
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`/api/programs/${programId}/slots`, form, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Slot added!");
        setForm({ day: "", time: "", trainer: "", maxCapacity: "" });
        fetchProgram();
      });
  };

  // Διαγραφή slot
  const deleteSlot = (slotId) => {
    axios.delete(`/api/programs/${programId}/slots/${slotId}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Slot deleted!");
        fetchProgram();
      });
  };

  return (
    <div>
      <h4>Slot Management for program: {program?.name}</h4>
      <form onSubmit={handleSubmit}>
        <input value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} placeholder="Day" required />
        <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="Time" required />
        <select value={form.trainer} onChange={e => setForm(f => ({ ...f, trainer: e.target.value }))} required>
          <option value="">Trainer</option>
          {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
        <input type="number" value={form.maxCapacity} onChange={e => setForm(f => ({ ...f, maxCapacity: e.target.value }))} placeholder="Capacity" required />
        <button type="submit">Add Slot</button>
      </form>
      {msg && <div>{msg}</div>}
      {program?.schedule?.map(slot => (
        <div key={slot._id}>
          {slot.day} | {slot.time} | {trainers.find(t => t._id === slot.trainer)?.name || "—"} | Capacity: {slot.maxCapacity}
          <button onClick={() => deleteSlot(slot._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}