import api from "./axios";

export async function getCourses() {
  const res = await api.get("/courses");
  return res.data;
}

export async function createCourse(payload) {
  const res = await api.post("/courses", payload);
  return res.data;
}
