import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Διαχείριση χρηστών: CRUD και αλλαγή ρόλου
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  // Φόρτωση όλων των χρηστών κατά το mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Λήψη χρηστών από το API
  const fetchUsers = () => {
    axios.get("/api/users", { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => setUsers(res.data));
  };

  // Διαγραφή χρήστη
  const deleteUser = (id) => {
    axios.delete(`/api/users/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("User deleted successfully!");
        fetchUsers();
      });
  };

  // Αλλαγή ρόλου χρήστη
  const changeRole = (id, newRole) => {
    axios.put(`/api/users/${id}`, { role: newRole }, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        setMsg("Role updated!");
        fetchUsers();
      });
  };

  return (
    <div>
      <h3>User Management</h3>
      {msg && <div>{msg}</div>}
      {users.map(u => (
        <div key={u._id}>
          {u.username} ({u.email}) | Role: {u.role}
          <button onClick={() => changeRole(u._id, u.role === "admin" ? "user" : "admin")}>
            Set as {u.role === "admin" ? "User" : "Admin"}
          </button>
          <button onClick={() => deleteUser(u._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}