import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios.get("/api/bookings/all", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => setBookings(res.data))
    .catch(() => setBookings([]))
    .finally(() => setLoading(false));
  }, [user.token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>All Bookings</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Program</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.user?.username}</td>
              <td>{b.user?.email}</td>
              <td>{b.program?.name}</td>
              <td>{b.schedule?.date ? new Date(b.schedule.date).toLocaleDateString() : ""}</td>
              <td>{b.schedule?.time}</td>
              <td>{b.cancelled ? "Cancelled" : "Active"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}