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
      // 1. Получаем строку токена
      const token = await apiLogin(username, password);

      if (!token) {
        alert("Ошибка: сервер не вернул токен");
        return;
      }

      // 2. Сохраняем токен (роль пока не знаем)
      login(token);

      // 3. Получаем данные пользователя
      const me = await api.get("/users/me");

      // 4. Сохраняем роль
      login(token, me.data.role);

      // 5. Переход
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
