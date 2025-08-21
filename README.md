# Gym Reservation System - README

## Contents

1. [Additional Assumptions and Deviations](#additional-assumptions-and-deviations)
2. [Technologies Used](#technologies-used)
3. [Description of Constructed Files](#description-of-constructed-files)
4. [Database Description](#database-description)
5. [System Execution Guide](#system-execution-guide)
6. [System Usage Guide (with examples)](#system-usage-guide-with-examples)
7. [References](#references)

---

## Additional Assumptions and Deviations

- The backend is built with Node.js and Express.
- MongoDB is used as the database for storing users, bookings, programs, trainers, and announcements.
- Authentication is handled via middleware.
- The frontend is a React application (in the `frontend/` folder).
- The system is designed for gym management, including user registration, booking, program management, and announcements.
- Admin, trainer, and user roles are supported with different permissions.

---

## Technologies Used

- **Node.js** (backend runtime)
- **Express.js** (backend framework)
- **MongoDB** (database)
- **Mongoose** (MongoDB ODM)
- **React** (frontend framework)
- **JavaScript** (frontend & backend logic)
- **CSS** (frontend styling)

---

## Description of Constructed Files

- **app.js**: Main Express server setup and middleware
- **package.json**: Backend dependencies and scripts
- **controllers/**: Business logic for announcements, bookings, programs, trainers, and users
- **models/**: Mongoose schemas for Announcement, Booking, Program, Trainer, and User
- **routes/**: Express route definitions for each resource
- **middleware/auth.js**: Authentication and authorization middleware
- **frontend/**: React app (see `frontend/README.md` for details)
  - **src/components/**: React components for admin, user, and trainer interfaces
  - **src/hooks/useAuth.js**: Custom authentication hook

---

## Database Description

- **MongoDB** is used for persistent storage.
- Collections:
  - **users**: Stores user credentials, roles, and profile info
  - **bookings**: Stores gym slot reservations
  - **programs**: Stores gym programs/classes
  - **trainers**: Stores trainer profiles
  - **announcements**: Stores announcements for users

---

## System Execution Guide

1. **Prerequisites:**
   - Node.js and npm installed
   - MongoDB instance running (local or cloud)

2. **Backend Setup:**
   - Clone the repository:
     ```powershell
     git clone https://github.com/savvaskassas/Gym-Reservation-System.git
     cd Gym-Reservation-System
     ```
   - Install backend dependencies:
     ```powershell
     npm install
     ```
   - Configure environment variables (e.g., MongoDB URI) in a `.env` file if required.
   - Start the backend server:
     ```powershell
     node app.js
     ```

3. **Frontend Setup:**
   - Navigate to the frontend folder:
     ```powershell
     cd frontend
     npm install
     npm start
     ```
   - The React app will run on `http://localhost:3000` by default.

---

## System Usage Guide (with examples)

### 1. **User Registration and Login**
- Register a new user via the registration form.
- Login with your credentials to access booking features.

### 2. **Booking a Gym Slot**
- After login, navigate to the booking section.
- Select a date, time, and program, then confirm your booking.

### 3. **Admin Features**
- Admins can approve users, manage programs, trainers, and view all bookings.
- Access the admin panel after logging in as an admin.

### 4. **Trainer Features**
- Trainers can view assigned programs and manage their schedules.

### **Usage Examples:**
- **Book a slot:** Login as a user, go to Bookings, select a slot, and confirm.
- **Add a program:** Login as admin, go to Program Management, and add a new program.
- **Approve users:** Login as admin, go to Pending Users, and approve or reject registrations.

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://reactjs.org/)
- [Mongoose Documentation](https://mongoosejs.com/)
