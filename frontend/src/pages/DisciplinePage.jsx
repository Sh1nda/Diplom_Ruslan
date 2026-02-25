import React from "react";

import { useEffect, useState } from "react";
import { getDiscipline, createDisciplineRecord } from "../api/discipline";

export default function DisciplinePage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    cadet_id: "",
    commander_id: "",
    violation_type: "",
    description: "",
    action_taken: "",
  });

  async function load() {
    const data = await getDiscipline();
    setRecords(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    await createDisciplineRecord({
      cadet_id: Number(form.cadet_id),
      commander_id: Number(form.commander_id),
      violation_type: form.violation_type,
      description: form.description,
      action_taken: form.action_taken,
    });
    setForm({
      cadet_id: "",
      commander_id: "",
      violation_type: "",
      description: "",
      action_taken: "",
    });
    load();
  }

  return (
    <div>
      <h2>Дисциплинарные записи</h2>
      <form onSubmit={submit}>
        <input
          placeholder="ID курсанта"
          value={form.cadet_id}
          onChange={(e) => setForm({ ...form, cadet_id: e.target.value })}
        />
        <input
          placeholder="ID командира"
          value={form.commander_id}
          onChange={(e) => setForm({ ...form, commander_id: e.target.value })}
        />
        <input
          placeholder="Тип нарушения"
          value={form.violation_type}
          onChange={(e) =>
            setForm({ ...form, violation_type: e.target.value })
          }
        />
        <input
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Принятые меры"
          value={form.action_taken}
          onChange={(e) =>
            setForm({ ...form, action_taken: e.target.value })
          }
        />
        <button type="submit">Добавить</button>
      </form>

      <table border="1" cellPadding="4" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Курсант</th>
            <th>Командир</th>
            <th>Тип</th>
            <th>Описание</th>
            <th>Меры</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.cadet_id}</td>
              <td>{r.commander_id}</td>
              <td>{r.violation_type}</td>
              <td>{r.description}</td>
              <td>{r.action_taken}</td>
              <td>{r.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
