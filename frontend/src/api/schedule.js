// src/api/schedule.js
import api from "./axios";

export async function getSchedule(params) {
  const res = await api.get("/schedule", { params });
  return res.data;
}

function normalizePayload(data) {
  return {
    course_id: Number(data.course_id),
    teacher_id: Number(data.teacher_id),
    group_id: Number(data.group_id),
    start_time: new Date(data.start_time).toISOString(),
    end_time: new Date(data.end_time).toISOString(),
    room: data.room || null,
  };
}

export async function createScheduleItem(data) {
  const payload = normalizePayload(data);
  const res = await api.post("/schedule", payload);
  return res.data;
}

export async function updateScheduleItem(id, data) {
  const payload = normalizePayload(data);
  const res = await api.put(`/schedule/${id}`, payload);
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
