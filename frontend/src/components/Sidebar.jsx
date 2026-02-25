import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { role } = useAuth();

  return (
    <div className="sidebar">
      <Link to="/">Главная</Link>
      <Link to="/schedule">Расписание</Link>
      <Link to="/courses">Курсы</Link>
      <Link to="/documents">Документы</Link>

      {role === "ADMIN" && <Link to="/users">Пользователи</Link>}

      {(role === "TEACHER" || role === "COMMANDER") && (
        <Link to="/attendance">Посещаемость</Link>
      )}

      {role === "COMMANDER" && <Link to="/discipline">Дисциплина</Link>}
    </div>
  );
}
