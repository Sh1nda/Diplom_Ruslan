import React, { useEffect, useState } from "react";
import { getDocuments, uploadDocument } from "../api/documents";
import "./DocumentsPage.css";

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    file_path: "",
    uploaded_by: "",
  });

  async function load() {
    const data = await getDocuments();
    setDocs(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();

    await uploadDocument({
      title: form.title,
      category: form.category || null,
      description: form.description || null,
      file_path: form.file_path,
      uploaded_by: Number(form.uploaded_by),
    });

    setForm({
      title: "",
      category: "",
      description: "",
      file_path: "",
      uploaded_by: "",
    });

    load();
  }

  return (
    <div className="docs-container">
      <h2 className="page-title">Документы</h2>

      {/* Форма */}
      <div className="card">
        <h3 className="card-title">Добавить документ</h3>

        <form onSubmit={submit} className="form-grid">
          <input
            placeholder="Название"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Категория"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Путь к файлу"
            value={form.file_path}
            onChange={(e) => setForm({ ...form, file_path: e.target.value })}
          />

          <input
            placeholder="ID загрузившего"
            value={form.uploaded_by}
            onChange={(e) =>
              setForm({ ...form, uploaded_by: e.target.value })
            }
          />

          <button type="submit" className="btn-primary form-submit">
            Добавить
          </button>
        </form>
      </div>

      {/* Таблица */}
      <div className="card">
        <h3 className="card-title">Список документов</h3>

        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Путь</th>
              <th>Загрузил</th>
              <th>Дата</th>
            </tr>
          </thead>

          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.title}</td>
                <td>{d.category}</td>
                <td>{d.file_path}</td>
                <td>{d.uploaded_by_name || d.uploaded_by}</td>
                <td>{new Date(d.uploaded_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
