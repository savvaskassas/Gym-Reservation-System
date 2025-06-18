import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import "./index.css"; // optional, create for your custom styles

// Τοποθετούμε το AuthProvider γύρω από το App για να έχουν όλα τα components πρόσβαση στο authentication context
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);