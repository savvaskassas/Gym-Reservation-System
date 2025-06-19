import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Διαχείριση γυμναστών: CRUD λειτουργίες
export default function TrainerManagement() {
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  // Φόρτωση γυμναστών κατά το mount
  useEffect(() => { fetchTrainers(); }, []);

  // Λήψη λίστας γυμναστών
  const fetchTrainers = () => {
    axios.get("/api/trainers").then(res => setTrainers(res.data));
  };

  // Υποβολή νέου γυμναστή
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/trainers", form, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Trainer added!");
        setForm({ name: "" });
        fetchTrainers();
      });
  };

  // Διαγραφή γυμναστή
  const deleteTrainer = (id) => {
    axios.delete(`/api/trainers/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Trainer deleted!");
        fetchTrainers();
      });
  };

  return (
    <div>
      <h3>Trainer Management</h3>
      <form onSubmit={handleSubmit}>
        <input value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="Name" required />
        <button type="submit">Add</button>
      </form>
      {msg && <div>{msg}</div>}
      {trainers.map(t => (
        <div key={t._id}>
          {t.name}
          <button onClick={() => deleteTrainer(t._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}