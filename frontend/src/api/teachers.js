import api from "./axios";

export async function getTeachers() {
  const res = await api.get("/users?role=TEACHER");
  return res.data;
}
