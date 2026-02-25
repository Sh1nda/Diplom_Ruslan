import api from "./axios";

export async function getDiscipline(params = {}) {
  const res = await api.get("/discipline", { params });
  return res.data;
}

export async function createDisciplineRecord(payload) {
  const res = await api.post("/discipline", payload);
  return res.data;
}
