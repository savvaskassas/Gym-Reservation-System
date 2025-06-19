import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Διαχείριση χρηστών που περιμένουν έγκριση (pending)
export default function PendingUsers() {
  const [pending, setPending] = useState([]);
  const { user } = useAuth();

  // Φόρτωση χρηστών που περιμένουν έγκριση
  useEffect(() => {
    axios.get("/api/users/pending", {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(res => setPending(res.data));
  }, [user.token]);

  // Έγκριση χρήστη
  const approve = (id) => {
    axios.put(`/api/users/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(() => setPending(p => p.filter(u => u._id !== id)));
  };

  // Απόρριψη/Διαγραφή χρήστη
  const reject = (id) => {
    axios.delete(`/api/users/reject/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    }).then(() => setPending(p => p.filter(u => u._id !== id)));
  };

  return (
    <div>
      <h3>Registration Requests</h3>
      {/* Εμφάνιση χρηστών που περιμένουν έγκριση */}
      {pending.map(u => (
        <div key={u._id}>
          {u.username} ({u.email})
          <button onClick={() => approve(u._id)}>Approve</button>
          <button onClick={() => reject(u._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}