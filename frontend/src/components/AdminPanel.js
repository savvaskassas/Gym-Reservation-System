import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import PendingUsers from "./PendingUsers";
import UserManagement from "./UserManagement";
import TrainerManagement from "./TrainerManagement";
import ProgramManagement from "./ProgramManagement";
import AnnouncementManagement from "./AnnouncementManagement";
import AdminBookings from "./AdminBookings"; // ΝΕΟ

export default function AdminPanel() {
  const [view, setView] = useState("pending");
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <div>Access denied. Only admins can view this page.</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={() => setView("pending")}>Registration Requests</button>
      <button onClick={() => setView("users")}>Users</button>
      <button onClick={() => setView("bookings")}>Bookings</button> {/* ΝΕΟ */}
      <button onClick={() => setView("trainers")}>Trainers</button>
      <button onClick={() => setView("programs")}>Programs</button>
      <button onClick={() => setView("announcements")}>Announcements</button>
      {view === "pending" && <PendingUsers />}
      {view === "users" && <UserManagement />}
      {view === "bookings" && <AdminBookings />} {/* ΝΕΟ */}
      {view === "trainers" && <TrainerManagement />}
      {view === "programs" && <ProgramManagement />}
      {view === "announcements" && <AnnouncementManagement />}
    </div>
  );
}