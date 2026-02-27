import React, { useEffect, useState } from "react";
import { getCourses, createCourse, deleteCourse } from "../api/courses";
import { getSchedule } from "../api/schedule";
import { useAuth } from "../hooks/useAuth";
import "./CoursesPage.css";

export default function CoursesPage() {
  const { role } = useAuth();
  const isCadet = role === "CADET";

  const [courses, setCourses] = useState([]);
  const [teachersByCourse, setTeachersByCourse] = useState({});
  const [form, setForm] = useState({ title: "", description: "" });

  async function load() {
    const data = await getCourses();
    setCourses(data);

    // Загружаем расписание, чтобы собрать преподавателей по курсам
    const schedule = await getSchedule();

    const map = {};
    schedule.forEach((item) => {
      if (!map[item.course_id]) map[item.course_id] = new Set();
      map[item.course_id].add(item.teacher_name);
    });

    // Преобразуем Set → массив
    const normalized = {};
    Object.keys(map).forEach((cid) => {
      normalized[cid] = Array.from(map[cid]);
    });

    setTeachersByCourse(normalized);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (isCadet) return;

    await createCourse(form);
    setForm({ title: "", description: "" });
    load();
  }

  async function removeCourse(id) {
    if (isCadet) return;

    await deleteCourse(id);
    load();
  }

  return (
    <div className="courses-container">
      <h2 className="page-title">Учебные дисциплины</h2>

      {/* Форма — скрыта для кадета */}
      {!isCadet && (
        <div className="card">
          <h3 className="card-title">Создать дисциплину</h3>

          <form onSubmit={submit} className="form-grid">
            <input
              placeholder="Название"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              placeholder="Описание"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button type="submit" className="btn-primary form-submit">
              Создать
            </button>
          </form>
        </div>
      )}

      {/* Таблица */}
      <div className="card">
        <h3 className="card-title">Список дисциплин</h3>

        <table className="styled-table">
          <thead>
            <tr>
              {!isCadet && <th>ID</th>}
              <th>Название</th>
              <th>Описание</th>
              <th>Преподаватели</th>
              {!isCadet && <th></th>}
            </tr>
          </thead>

          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                {!isCadet && <td>{c.id}</td>}
                <td>{c.title}</td>
                <td>{c.description}</td>

                {/* Преподаватели */}
                <td>
                  {(teachersByCourse[c.id] || []).join(", ") || "—"}
                </td>

                {/* Удаление — только не для кадета */}
                {!isCadet && (
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => removeCourse(c.id)}
                    >
                      Удалить
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
