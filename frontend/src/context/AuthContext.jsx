import React, { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = (newToken, newRole) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem("access_token", newToken);
    }
    if (newRole) {
      setRole(newRole);
      localStorage.setItem("role", newRole);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
