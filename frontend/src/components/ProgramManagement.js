import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import SlotManagement from "./SlotManagement"; // import the component

// Διαχείριση προγραμμάτων: CRUD λειτουργίες
export default function ProgramManagement() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", trainer: "" });
  const [trainers, setTrainers] = useState([]);
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  // state για να trackάρεις ποια προγράμματα έχουν ανοιχτά τα slots
  const [openSlots, setOpenSlots] = useState({});

  // Φόρτωση προγραμμάτων και γυμναστών κατά το mount
  useEffect(() => {
    fetchPrograms();
    axios.get("/api/trainers").then(res => setTrainers(res.data));
  }, []);

  // Λήψη λίστας προγραμμάτων
  const fetchPrograms = () => {
    axios.get("/api/programs").then(res => setPrograms(res.data));
  };

  // Υποβολή νέου προγράμματος
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/programs", form, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Program added!");
        setForm({ name: "", type: "", trainer: "" });
        fetchPrograms();
      });
  };

  // Διαγραφή προγράμματος
  const deleteProgram = (id) => {
    axios.delete(`/api/programs/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Program deleted!");
        fetchPrograms();
      });
  };

  // Εναλλαγή εμφάνισης slots για κάθε πρόγραμμα
  const toggleSlots = (programId) => {
    setOpenSlots(prev => ({ ...prev, [programId]: !prev[programId] }));
  };

  return (
    <div>
      <h3>Program Management</h3>
      <form onSubmit={handleSubmit}>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" required />
        <input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="Type" required />
        <select value={form.trainer} onChange={e => setForm(f => ({ ...f, trainer: e.target.value }))} required>
          <option value="">Trainer</option>
          {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
        <button type="submit">Add</button>
      </form>
      {msg && <div>{msg}</div>}
      {programs.map(p => (
        <div key={p._id} style={{ marginBottom: "1em", border: "1px solid #ddd", padding: "1em" }}>
          <div>
            <b>{p.name}</b> ({p.type})
            <button onClick={() => deleteProgram(p._id)} style={{ marginLeft: 8 }}>Delete</button>
            <button onClick={() => toggleSlots(p._id)} style={{ marginLeft: 8 }}>
              {openSlots[p._id] ? "Hide Slots" : "Manage Slots"}
            </button>
          </div>
          {openSlots[p._id] && (
            <div style={{ marginTop: 8 }}>
              <SlotManagement programId={p._id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}