import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загружаем токен и роль из localStorage
  useEffect(() => {
    const t = localStorage.getItem("access_token");
    const r = localStorage.getItem("role");

    if (t) setToken(t);
    if (r) setRole(r);

    setLoading(false);
  }, []);

  // Загружаем user, когда есть токен
  useEffect(() => {
    if (!token) return;

    async function loadUser() {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (e) {
        console.error("Ошибка загрузки user", e);
        setUser(null);
      }
    }

    loadUser();
  }, [token]);

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
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
