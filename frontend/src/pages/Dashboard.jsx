import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getSchedule } from "../api/schedule";
import { getDocuments } from "../api/documents";
import { getDiscipline } from "../api/discipline";
import { getAttendance } from "../api/attendance";
import { getGroupMembers, getGroups } from "../api/groups";
import { getUsers } from "../api/users";
import "./Dashboard.css";

export default function Dashboard() {
  const { role, user, loading } = useAuth();

  // Общие данные
  const [lessons, setLessons] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [discipline, setDiscipline] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Командир
  const [cadets, setCadets] = useState([]);

  // Админ
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!loading && user) {
      if (role === "ADMIN") loadAdminData();
      else if (role === "COMMANDER") loadCommanderData();
      else if (role === "TEACHER") loadTeacherData();
      else if (role === "CADET") loadCadetData();
    }
  }, [loading, user]);

  // -------------------------------------------------------
  // ADMIN PANEL
  // -------------------------------------------------------
  async function loadAdminData() {
    const usersData = await getUsers();
    const groupsData = await getGroups();
    const docs = await getDocuments();

    setUsers(usersData);
    setGroups(groupsData);
    setDocuments(docs.slice(0, 5));
  }

  // -------------------------------------------------------
  // COMMANDER PANEL
  // -------------------------------------------------------
  async function loadCommanderData() {
    const groupId = user.group_id;

    const members = await getGroupMembers(groupId);
    setCadets(members);

    const today = new Date().toISOString().split("T")[0];
    const lessonsData = await getSchedule({ date: today, group_id: groupId });
    setLessons(lessonsData.slice(0, 3));

    const disc = await getDiscipline({ group_id: groupId });
    setDiscipline(disc.slice(0, 3));

    const att = await getAttendance();
    setAttendance(att);
  }

  // -------------------------------------------------------
  // TEACHER PANEL
  // -------------------------------------------------------
  async function loadTeacherData() {
    const lessonsData = await getSchedule({ teacher_id: user.id });
    setLessons(lessonsData.slice(0, 5));

    const att = await getAttendance();
    setAttendance(att.filter((a) => a.teacher_id === user.id));

    const docs = await getDocuments();
    setDocuments(docs.slice(0, 3));
  }

  // -------------------------------------------------------
  // CADET PANEL
  // -------------------------------------------------------
  async function loadCadetData() {
    const today = new Date().toISOString().split("T")[0];

    const lessonsData = await getSchedule({
      date: today,
      group_id: user.group_id,
    });
    setLessons(lessonsData.slice(0, 3));

    const docs = await getDocuments();
    setDocuments(docs.slice(0, 3));

    const disc = await getDiscipline({ cadet_id: user.id });
    setDiscipline(disc.slice(0, 3));
  }

  if (loading || !user) {
    return <div className="dashboard">Загрузка...</div>;
  }

  // -------------------------------------------------------
  // ADMIN RENDER
  // -------------------------------------------------------
  if (role === "ADMIN") {
    const cadetsCount = users.filter((u) => u.role === "CADET").length;
    const commandersCount = users.filter((u) => u.role === "COMMANDER").length;
    const teachersCount = users.filter((u) => u.role === "TEACHER").length;

    return (
      <div className="dashboard">
        <h2>Административная панель</h2>
        <p>Добро пожаловать, {user.full_name}. Ваша роль: <b>ADMIN</b></p>

        <div className="dashboard-grid">

          <div className="card">
            <h3>Пользователи</h3>
            <div className="item">Всего: {users.length}</div>
            <div className="item">Кадеты: {cadetsCount}</div>
            <div className="item">Командиры: {commandersCount}</div>
            <div className="item">Преподаватели: {teachersCount}</div>
          </div>

          <div className="card">
            <h3>Группы</h3>
            <div className="item">Всего групп: {groups.length}</div>
            <div className="item">Всего кадетов: {cadetsCount}</div>
          </div>

          <div className="card">
            <h3>Последние документы</h3>
            {documents.map((d) => (
              <div key={d.id} className="item">{d.title}</div>
            ))}
          </div>

          <div className="card">
            <h3>Новые пользователи</h3>
            {users.slice(-5).map((u) => (
              <div key={u.id} className="item">
                {u.full_name} — {u.role}
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // COMMANDER RENDER
  // -------------------------------------------------------
  if (role === "COMMANDER") {
    const todayAbsent = attendance.filter((a) => !a.present);
    const todayPresent = attendance.filter((a) => a.present);

    return (
      <div className="dashboard">
        <h2>Панель командира</h2>
        <p>Добро пожаловать, {user.full_name}. Ваша группа: <b>{user.group_name}</b></p>

        <div className="dashboard-grid">

          <div className="card">
            <h3>Состояние группы</h3>
            <div className="item">Кадетов: {cadets.length}</div>
            <div className="item">Присутствуют: {todayPresent.length}</div>
            <div className="item">Отсутствуют: {todayAbsent.length}</div>
          </div>

          <div className="card">
            <h3>Отсутствующие сегодня</h3>
            {todayAbsent.length === 0 && <p>Все присутствуют</p>}
            {todayAbsent.map((a) => (
              <div key={a.id} className="item">{a.cadet_name}</div>
            ))}
          </div>

          <div className="card">
            <h3>Ближайшие занятия</h3>
            {lessons.map((l) => (
              <div key={l.id} className="item">
                <b>{l.course_title}</b> — {new Date(l.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Дисциплина группы</h3>
            {discipline.map((r) => (
              <div key={r.id} className="item">
                {r.cadet_name}: {r.violation_type}
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // TEACHER RENDER
  // -------------------------------------------------------
  if (role === "TEACHER") {
    const today = new Date().toISOString().split("T")[0];
    const todayLessons = lessons.filter(
      (l) => l.start_time.split("T")[0] === today
    );
    const groupsToday = [...new Set(todayLessons.map((l) => l.group_name))];

    return (
      <div className="dashboard">
        <h2>Панель преподавателя</h2>
        <p>Добро пожаловать, {user.full_name}. Ваши занятия на сегодня.</p>

        <div className="dashboard-grid">

          <div className="card">
            <h3>Ближайшие занятия</h3>
            {lessons.map((l) => (
              <div key={l.id} className="item">
                <b>{l.course_title}</b> — {l.group_name} —{" "}
                {new Date(l.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Группы сегодня</h3>
            {groupsToday.map((g) => (
              <div key={g} className="item">{g}</div>
            ))}
          </div>

          <div className="card">
            <h3>Последняя посещаемость</h3>
            {attendance.slice(0, 5).map((a) => (
              <div key={a.id} className="item">
                {a.cadet_name}: {a.present ? "Присутствовал" : "Отсутствовал"}
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // CADET RENDER
  // -------------------------------------------------------
  return (
    <div className="dashboard">
      <h2>Главная панель</h2>
      <p>Добро пожаловать, {user.full_name}. Ваша роль: <b>CADET</b></p>

      <div className="dashboard-grid">

        <div className="card">
          <h3>Ближайшие занятия</h3>
          {lessons.map((l) => (
            <div key={l.id} className="item">
              <b>{l.course_title}</b> —{" "}
              {new Date(l.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Последние документы</h3>
          {documents.map((d) => (
            <div key={d.id} className="item">{d.title}</div>
          ))}
        </div>

        <div className="card">
          <h3>Дисциплина</h3>
          {discipline.map((r) => (
            <div key={r.id} className="item">
              {r.violation_type}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
