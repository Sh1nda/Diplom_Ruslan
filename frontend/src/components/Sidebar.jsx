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

      {/* Пользователи — только для админа */}
      {role === "ADMIN" && <Link to="/users">Пользователи</Link>}

      {/* Посещаемость — для преподавателя и командира */}
      {(role === "TEACHER" || role === "COMMANDER") && (
        <Link to="/attendance">Посещаемость</Link>
      )}

      {(role === "COMMANDER" || role === "ADMIN") && (
  <Link to="/discipline">Дисциплина</Link>
)}


      {/* Группы — например, для админа и командира */}
      {(role === "ADMIN" || role === "COMMANDER") && (
        <Link to="/groups">Группы</Link>
      )}
    </div>
  );
}
