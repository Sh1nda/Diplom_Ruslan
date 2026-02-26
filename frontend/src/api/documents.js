import api from "./axios";

export async function getDocuments(params = {}) {
  const res = await api.get("/documents/", { params });
  return res.data;
}

export async function uploadDocument(formData) {
  const res = await api.post("/documents/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteDocument(id) {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
}
