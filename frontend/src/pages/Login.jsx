import React, { useState } from "react";
import { login as apiLogin } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      // 1. Получаем токен
      const token = await apiLogin(username, password);

      // 2. Сохраняем токен
      login(token, null);

      // 3. Ждём, чтобы localStorage обновился
      await new Promise((r) => setTimeout(r, 50));

      // 4. Получаем роль
      const me = await api.get("/users/me");

      // 5. Сохраняем роль
      login(token, me.data.role);

      // 6. Переход
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Ошибка входа");
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 300, margin: "60px auto" }}>
      <h2>Вход</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}
