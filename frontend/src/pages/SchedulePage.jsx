import React from "react";

import { useEffect, useState } from "react";
import { getSchedule, createScheduleItem } from "../api/schedule";

export default function SchedulePage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    course_id: "",
    teacher_id: "",
    group_name: "",
    start_time: "",
    end_time: "",
    room: "",
  });

  async function load() {
    const data = await getSchedule();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    await createScheduleItem({
      ...form,
      course_id: Number(form.course_id),
      teacher_id: Number(form.teacher_id),
    });
    setForm({
      course_id: "",
      teacher_id: "",
      group_name: "",
      start_time: "",
      end_time: "",
      room: "",
    });
    load();
  }

  return (
    <div>
      <h2>Расписание</h2>
      <form onSubmit={submit}>
        <input
          placeholder="ID курса"
          value={form.course_id}
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}
        />
        <input
          placeholder="ID преподавателя"
          value={form.teacher_id}
          onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
        />
        <input
          placeholder="Группа"
          value={form.group_name}
          onChange={(e) => setForm({ ...form, group_name: e.target.value })}
        />
        <input
          type="datetime-local"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
        />
        <input
          type="datetime-local"
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
        />
        <input
          placeholder="Аудитория"
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
        />
        <button type="submit">Добавить</button>
      </form>

      <table border="1" cellPadding="4" style={{ marginTop: 20 }}>
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
              <td>{s.course_id}</td>
              <td>{s.teacher_id}</td>
              <td>{s.group_name}</td>
              <td>{s.start_time}</td>
              <td>{s.end_time}</td>
              <td>{s.room}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
