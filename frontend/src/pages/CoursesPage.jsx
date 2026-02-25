import React from "react";
import { useEffect, useState } from "react";
import { getCourses, createCourse } from "../api/courses";

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

  return (
    <div>
      <h2>Учебные курсы</h2>
      <form onSubmit={submit}>
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
        <button type="submit">Создать</button>
      </form>

      <table border="1" cellPadding="4" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
