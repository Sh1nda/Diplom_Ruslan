import api from "./axios";

export async function getDiscipline(params = {}) {
  const res = await api.get("/discipline", { params });
  return res.data;
}

export async function createDiscipline(payload) {
  const res = await api.post("/discipline", payload);
  return res.data;
}

export async function deleteDiscipline(id) {
  const res = await api.delete(`/discipline/${id}`);
  return res.data;
}
