import { useState, useEffect, createContext, useContext } from "react";

// Δημιουργούμε context για τα δεδομένα αυθεντικοποίησης (user info, login/logout)
const AuthContext = createContext();

// Provider που τυλίγει όλο το app και παρέχει user, login και logout
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Όταν φορτώνει η εφαρμογή, αν υπάρχει αποθηκευμένος user στο localStorage, τον φορτώνει
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Αποθηκεύει τον user στο state και στο localStorage (μετά το login)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Διαγράφει τον user από state και localStorage (logout)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Παρέχει τα δεδομένα και τις συναρτήσεις σε όλα τα components
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook για να χρησιμοποιούμε εύκολα το context στα components
export function useAuth() {
  return useContext(AuthContext);
}