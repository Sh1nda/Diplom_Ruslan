import React, { useEffect, useState } from "react";
import { getCourses, createCourse, deleteCourse } from "../api/courses";
import "./CoursesPage.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  async function load() {
    const data = await getCourses();
    setCourses(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    await createCourse(form);
    setForm({ title: "", description: "" });
    load();
  }

  async function removeCourse(id) {
    await deleteCourse(id);
    load();
  }

  return (
    <div className="courses-container">
      <h2 className="page-title">Учебные дисциплины</h2>

      {/* Форма */}
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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button type="submit" className="btn-primary form-submit">
            Создать
          </button>
        </form>
      </div>

      {/* Таблица */}
      <div className="card">
        <h3 className="card-title">Список дисциплин</h3>

        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => removeCourse(c.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
