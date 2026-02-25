import api from "./axios";

export async function getAttendance(params = {}) {
  const res = await api.get("/attendance", { params });
  return res.data;
}

export async function markAttendance(payload) {
  const res = await api.post("/attendance", payload);
  return res.data;
}
