import api from "./axios";

export async function getSchedule(params = {}) {
  const res = await api.get("/schedule", { params });
  return res.data;
}

export async function createScheduleItem(payload) {
  const res = await api.post("/schedule", payload);
  return res.data;
}
