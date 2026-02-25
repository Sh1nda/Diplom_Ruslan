import React from "react";

import { useEffect, useState } from "react";
import { getUsers, createUser } from "../api/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    password: "",
    role: "CADET",
  });

  async function load() {
    const data = await getUsers();
    setUsers(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    await createUser(form);
    setForm({ username: "", full_name: "", password: "", role: "CADET" });
    load();
  }

  return (
    <div>
      <h2>Пользователи</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Логин"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="ФИО"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <input
          placeholder="Пароль"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="COMMANDER">COMMANDER</option>
          <option value="TEACHER">TEACHER</option>
          <option value="CADET">CADET</option>
        </select>
        <button type="submit">Создать</button>
      </form>

      <table border="1" cellPadding="4" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>ФИО</th>
            <th>Роль</th>
            <th>Активен</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td>{u.is_active ? "Да" : "Нет"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
