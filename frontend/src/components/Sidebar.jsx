import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Sidebar.css";

export default function Sidebar() {
  const { role } = useAuth();

  return (
    <div className="sidebar">
      <Link to="/">Главная</Link>
      <Link to="/schedule">Расписание</Link>
      <Link to="/courses">Курсы</Link>
      <Link to="/documents">Документы</Link>

      {/* Пользователи — только админ */}
      {role === "ADMIN" && <Link to="/users">Пользователи</Link>}

      {/* Посещаемость — ADMIN, TEACHER, COMMANDER, CADET (теперь кадет тоже видит) */}
      {(role === "ADMIN" ||
        role === "TEACHER" ||
        role === "COMMANDER" ||
        role === "CADET") && (
        <Link to="/attendance">Посещаемость</Link>
      )}

      {/* Дисциплина — ADMIN, COMMANDER, CADET */}
      {(role === "ADMIN" || role === "COMMANDER" || role === "CADET") && (
        <Link to="/discipline">Дисциплина</Link>
      )}

      {/* Группы — ADMIN, COMMANDER */}
      {(role === "ADMIN" || role === "COMMANDER") && (
        <Link to="/groups">Группы</Link>
      )}
    </div>
  );
}
