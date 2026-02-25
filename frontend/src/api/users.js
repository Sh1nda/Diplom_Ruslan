import api from "./axios";

export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

export async function createUser(payload) {
  const res = await api.post("/users", payload);
  return res.data;
}
