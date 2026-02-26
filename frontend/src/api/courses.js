import api from "./axios";

export async function getCourses() {
  const res = await api.get("/courses");
  return res.data;
}

export async function createCourse(payload) {
  const res = await api.post("/courses", payload);
  return res.data;
}

export async function deleteCourse(id) {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
}
