import React from "react";

import { useEffect, useState } from "react";
import { getAttendance, markAttendance } from "../api/attendance";

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    schedule_item_id: "",
    cadet_id: "",
    present: true,
  });

  async function load() {
    const data = await getAttendance();
    setRecords(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    await markAttendance({
      schedule_item_id: Number(form.schedule_item_id),
      cadet_id: Number(form.cadet_id),
      present: form.present,
    });
    setForm({ schedule_item_id: "", cadet_id: "", present: true });
    load();
  }

  return (
    <div>
      <h2>Посещаемость</h2>
      <form onSubmit={submit}>
        <input
          placeholder="ID занятия"
          value={form.schedule_item_id}
          onChange={(e) =>
            setForm({ ...form, schedule_item_id: e.target.value })
          }
        />
        <input
          placeholder="ID курсанта"
          value={form.cadet_id}
          onChange={(e) => setForm({ ...form, cadet_id: e.target.value })}
        />
        <select
          value={form.present ? "1" : "0"}
          onChange={(e) =>
            setForm({ ...form, present: e.target.value === "1" })
          }
        >
          <option value="1">Присутствовал</option>
          <option value="0">Отсутствовал</option>
        </select>
        <button type="submit">Отметить</button>
      </form>

      <table border="1" cellPadding="4" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Занятие</th>
            <th>Курсант</th>
            <th>Присутствие</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.schedule_item_id}</td>
              <td>{r.cadet_id}</td>
              <td>{r.present ? "Да" : "Нет"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
