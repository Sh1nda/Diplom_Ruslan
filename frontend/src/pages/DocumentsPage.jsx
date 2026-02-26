import React, { useEffect, useState } from "react";
import { getDocuments, uploadDocument, deleteDocument } from "../api/documents";
import "./DocumentsPage.css";

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    file: null,
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

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("category", form.category || "");
    fd.append("description", form.description || "");
    fd.append("uploaded_by", parseInt(form.uploaded_by, 10));

    if (form.file) fd.append("file", form.file);

    await uploadDocument(fd);

    setForm({
      title: "",
      category: "",
      description: "",
      file: null,
      uploaded_by: "",
    });

    load();
  }

  async function removeDoc(id) {
    await deleteDocument(id);
    load();
  }

  return (
    <div className="docs-page">

      <h2 className="page-title">Документы</h2>

      {/* Форма */}
      <div className="card upload-card">
        <h3 className="card-title">Добавить документ</h3>

        <form onSubmit={submit} className="form">

          <div className="form-group">
            <label>Название</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Введите название документа"
            />
          </div>

          <div className="form-group">
            <label>Категория</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Например: отчёт, приказ..."
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Краткое описание документа"
            />
          </div>

          <div className="form-group">
            <label>ID загрузившего</label>
            <input
              type="number"
              value={form.uploaded_by}
              onChange={(e) =>
                setForm({ ...form, uploaded_by: e.target.value })
              }
              placeholder="Введите ID пользователя"
            />
          </div>

          <div className="form-group">
            <label>Файл</label>
            <input
              type="file"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            />
          </div>

          <button type="submit" className="btn-primary">
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
              <th>Файл</th>
              <th>Загрузил</th>
              <th>Дата</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.title}</td>
                <td>{d.category}</td>
                <td>
                  {d.file_path ? (
                    <a href={d.file_path} target="_blank" rel="noreferrer">
                      Скачать
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{d.uploaded_by}</td>
                <td>{new Date(d.uploaded_at).toLocaleString()}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => removeDoc(d.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
