import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Component για εμφάνιση και διαχείριση χρηστών που περιμένουν έγκριση
function PendingUsers() {
  const [pending, setPending] = useState([]);
  const { user } = useAuth();

  // Φόρτωσε τους χρήστες που περιμένουν έγκριση όταν φορτώσει το component ή αλλάξει το token
  useEffect(() => {
    axios.get("/api/users/pending", {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setPending(res.data));
  }, [user.token]);

  // Έγκριση χρήστη (μετά το approve, αφαιρεί τον χρήστη από τη λίστα)
  const approve = (id) => {
    axios.put(`/api/users/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(() => setPending(p => p.filter(u => u._id !== id)));
  };

  // Απόρριψη/Διαγραφή χρήστη (μετά το reject, αφαιρεί τον χρήστη από τη λίστα)
  const reject = (id) => {
    axios.delete(`/api/users/reject/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(() => setPending(p => p.filter(u => u._id !== id)));
  };

  return (
    <div>
      <h3>Αιτήματα εγγραφής</h3>
      {/* Εμφανίζει κάθε χρήστη που περιμένει έγκριση με κουμπιά έγκρισης/απόρριψης */}
      {pending.map(u => (
        <div key={u._id}>
          {u.username} ({u.email})
          <button onClick={() => approve(u._id)}>Έγκριση</button>
          <button onClick={() => reject(u._id)}>Απόρριψη</button>
        </div>
      ))}
    </div>
  );
}

// Κύριο Admin Panel, όπου μπορείς να προσθέσεις και άλλες λειτουργίες admin (trainers, programs, announcements, users CRUD)
export default function AdminPanel() {
  return (
    <div>
      <h2>Πάνελ Διαχειριστή</h2>
      <PendingUsers />
    </div>
  );
}