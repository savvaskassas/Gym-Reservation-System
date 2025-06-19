import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Διαχείριση ανακοινώσεων: CRUD λειτουργίες
export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  // Φόρτωση ανακοινώσεων κατά το mount
  useEffect(() => { fetchAnnouncements(); }, []);

  // Λήψη λίστας ανακοινώσεων
  const fetchAnnouncements = () => {
    axios.get("/api/announcements", { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setAnnouncements(res.data));
  };

  // Υποβολή νέας ανακοίνωσης
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/announcements", form, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Announcement added!");
        setForm({ title: "", content: "" });
        fetchAnnouncements();
      });
  };

  // Διαγραφή ανακοίνωσης
  const deleteAnnouncement = (id) => {
    axios.delete(`/api/announcements/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Announcement deleted!");
        fetchAnnouncements();
      });
  };

  return (
    <div>
      <h3>Announcement Management</h3>
      <form onSubmit={handleSubmit}>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" required />
        <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Content" required />
        <button type="submit">Add</button>
      </form>
      {msg && <div>{msg}</div>}
      {announcements.map(a => (
        <div key={a._id}>
          <h4>{a.title}</h4>
          <div>{a.content}</div>
          <button onClick={() => deleteAnnouncement(a._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}