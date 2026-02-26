// src/api/schedule.js
import api from "./axios";

export async function getSchedule(params) {
  const res = await api.get("/schedule", { params });
  return res.data;
}

export async function createScheduleItem(data) {
  const res = await api.post("/schedule", data);
  return res.data;
}

export async function updateScheduleItem(id, data) {
  const res = await api.put(`/schedule/${id}`, data);
  return res.data;
}

export async function deleteScheduleItem(id) {
  const res = await api.delete(`/schedule/${id}`);
  return res.data;
}

export async function getWeeklySchedule(groupId) {
  const res = await api.get(`/schedule/weekly?group_id=${groupId}`);
  return res.data;
}
