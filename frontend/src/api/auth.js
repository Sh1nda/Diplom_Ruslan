import api from "./axios";

export async function login(username, password) {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);

  const res = await api.post("/auth/login", form);

  return res.data.access_token; // ← ВСЕГДА строка
}
