import React, { useEffect, useState } from "react";
import { getSchedule, createScheduleItem, getWeeklySchedule } from "../api/schedule";
import { getGroups } from "../api/groups";
import { getCourses } from "../api/courses";
import { getTeachers } from "../api/teachers";
import "./SchedulePage.css";

const WEEKDAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export default function SchedulePage() {
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [week, setWeek] = useState(null);

  const [form, setForm] = useState({
    course_id: "",
    teacher_id: "",
    group_id: "",
    start_time: "",
    end_time: "",
    room: "",
  });

  async function load() {
    setItems(await getSchedule());
  }

  async function loadGroups() {
    setGroups(await getGroups());
  }

  async function loadCourses() {
    setCourses(await getCourses());
  }

  async function loadTeachers() {
    setTeachers(await getTeachers());
  }

  async function loadWeek() {
    if (!groupId) return;
    setWeek(await getWeeklySchedule(groupId));
  }

  useEffect(() => {
    load();
    loadGroups();
    loadCourses();
    loadTeachers();
  }, []);

  async function submit(e) {
    e.preventDefault();

    await createScheduleItem({
      course_id: Number(form.course_id),
      teacher_id: Number(form.teacher_id),
      group_id: Number(form.group_id),
      start_time: form.start_time,
      end_time: form.end_time,
      room: form.room,
    });

    setForm({
      course_id: "",
      teacher_id: "",
      group_id: "",
      start_time: "",
      end_time: "",
      room: "",
    });

    load();
    loadWeek();
  }

  return (
    <div className="schedule-container">
      <h2 className="page-title">Расписание</h2>

      <div className="card">
        <h3 className="card-title">Добавить занятие</h3>

        <form onSubmit={submit} className="form-grid">

          {/* Курс */}
          <select
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
          >
            <option value="">Выберите курс</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          {/* Преподаватель */}
          <select
            value={form.teacher_id}
            onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
          >
            <option value="">Выберите преподавателя</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.full_name}</option>
            ))}
          </select>

          {/* Группа */}
          <select
            value={form.group_id}
            onChange={(e) => setForm({ ...form, group_id: e.target.value })}
          >
            <option value="">Выберите группу</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <input type="datetime-local"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          />

          <input type="datetime-local"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          />

          <input
            placeholder="Аудитория"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
          />

          <button type="submit" className="btn-primary form-submit">
            Добавить
          </button>
        </form>
      </div>

      {/* Таблица */}
      <div className="card">
        <h3 className="card-title">Все занятия</h3>

        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Курс</th>
              <th>Преподаватель</th>
              <th>Группа</th>
              <th>Начало</th>
              <th>Конец</th>
              <th>Аудитория</th>
            </tr>
          </thead>

          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.course_name}</td>
                <td>{s.teacher_name}</td>
                <td>{s.group_name}</td>
                <td>{new Date(s.start_time).toLocaleString()}</td>
                <td>{new Date(s.end_time).toLocaleString()}</td>
                <td>{s.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Недельное расписание */}
      <div className="card">
        <h3 className="card-title">Недельное расписание</h3>

        <div className="week-controls">
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">Выберите группу</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <button onClick={loadWeek} className="btn-secondary">
            Показать
          </button>
        </div>

        {week && (
          <div className="week-grid">
            {WEEKDAYS.map((day, index) => (
              <div key={day} className="week-column">
                <div className="week-day-title">{day}</div>

                {week[index].length === 0 && (
                  <div className="empty-slot">Нет занятий</div>
                )}

                {week[index].map((item) => (
                  <div key={item.id} className="lesson-card">
                    <div className="lesson-title">{item.course_name}</div>
                    <div className="lesson-teacher">{item.teacher_name}</div>
                    <div className="lesson-time">
                      {new Date(item.start_time).toLocaleTimeString()} —{" "}
                      {new Date(item.end_time).toLocaleTimeString()}
                    </div>
                    <div className="lesson-room">Ауд.: {item.room}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
