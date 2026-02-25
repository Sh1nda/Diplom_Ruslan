import React from "react";
import { useAuth } from "../hooks/useAuth";
export default function Navbar() {
  const { logout, role } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-title">Военно‑учебный центр</div>
      <div className="navbar-role">Роль: {role || "гость"}</div>
      {role && <button onClick={logout}>Выйти</button>}
    </div>
  );
}
