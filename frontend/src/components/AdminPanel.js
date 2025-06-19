import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import PendingUsers from "./PendingUsers"; // Υποθέτουμε ότι έχει μεταφερθεί σε ξεχωριστό αρχείο
import UserManagement from "./UserManagement";
import TrainerManagement from "./TrainerManagement";
import ProgramManagement from "./ProgramManagement";
import AnnouncementManagement from "./AnnouncementManagement";
// Για SlotManagement θα χρειαστεί επιλογή προγράμματος, δες σημείωση παρακάτω

// Κύριο πάνελ διαχειριστή – επιλογή εργαλείων admin UI
export default function AdminPanel() {
  // Το view καθορίζει ποιο admin component εμφανίζεται
  const [view, setView] = useState("pending");
  const { user } = useAuth();

  // Αν δεν είναι admin, δεν έχει πρόσβαση
  if (!user || user.role !== "admin") {
    return <div>Access denied. Only admins can view this page.</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {/* Κουμπιά πλοήγησης */}
      <button onClick={() => setView("pending")}>Registration Requests</button>
      <button onClick={() => setView("users")}>Users</button>
      <button onClick={() => setView("trainers")}>Trainers</button>
      <button onClick={() => setView("programs")}>Programs</button>
      <button onClick={() => setView("announcements")}>Announcements</button>
      {/* Αν θέλεις να προσθέσεις SlotManagement, θα πρέπει να επιλέγεται πρόγραμμα και να δίνεται το programId ως prop */}

      {/* Εμφάνιση του επιλεγμένου admin component */}
      {view === "pending" && <PendingUsers />}
      {view === "users" && <UserManagement />}
      {view === "trainers" && <TrainerManagement />}
      {view === "programs" && <ProgramManagement />}
      {view === "announcements" && <AnnouncementManagement />}
    </div>
  );
}