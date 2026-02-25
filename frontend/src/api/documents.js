import api from "./axios";

export async function getDocuments(params = {}) {
  const res = await api.get("/documents", { params });
  return res.data;
}

export async function uploadDocument(payload) {
  const res = await api.post("/documents", payload);
  return res.data;
}
