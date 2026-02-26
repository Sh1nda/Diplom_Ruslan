import React, { useEffect, useState } from "react";
import { getGroups } from "../api/groups";
import { getDiscipline, createDiscipline, deleteDiscipline } from "../api/discipline";
import api from "../api/axios";
import "./DisciplinePage.css";

export default function DisciplinePage() {
  const [groups, setGroups] = useState([]);
  const [cadets, setCadets] = useState([]);
  const [records, setRecords] = useState([]);

  const [groupId, setGroupId] = useState("");
  const [cadetId, setCadetId] = useState("");
  const [violationType, setViolationType] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (groupId) {
      loadCadets(groupId);
      loadRecords({ group_id: groupId });
    } else {
      setCadets([]);
      setRecords([]);
    }
  }, [groupId]);

  async function loadGroups() {
    const data = await getGroups();
    setGroups(data);
  }

  async function loadCadets(groupId) {
    const res = await api.get(`/groups/${groupId}/members`);
    setCadets(res.data);
  }

  async function loadRecords(params) {
    const data = await getDiscipline(params);
    setRecords(data);
  }

  async function submitRecord(e) {
    e.preventDefault();
    if (!groupId || !cadetId || !violationType) return;

    await createDiscipline({
      group_id: Number(groupId),
      cadet_id: Number(cadetId),
      violation_type: violationType,
      comment: comment || null,
    });

    setViolationType("");
    setComment("");
    await loadRecords({ group_id: groupId });
  }

  async function removeRecord(id) {
    await deleteDiscipline(id);
    await loadRecords({ group_id: groupId });
  }

  return (
    <div className="discipline-container">
      <h2 className="page-title">Дисциплина</h2>

      {/* Форма */}
      <div className="card">
        <h3 className="card-title">Добавить запись</h3>

        <form onSubmit={submitRecord} className="form-grid">

          <div className="form-field">
            <label>Группа</label>
            <select
              value={groupId}
              onChange={(e) => {
                setGroupId(e.target.value);
                setCadetId("");
              }}
            >
              <option value="">Выберите группу</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Кадет</label>
            <select
              value={cadetId}
              onChange={(e) => setCadetId(e.target.value)}
              disabled={!groupId}
            >
              <option value="">Выберите кадета</option>
              {cadets.map((m) => (
                <option key={m.id} value={m.cadet_id}>{m.full_name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Тип нарушения</label>
            <input
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
            />
          </div>

          <div className="form-field form-textarea">
            <label>Комментарий</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary form-submit">
            Добавить запись
          </button>
        </form>
      </div>

      {/* Таблица */}
      <div className="card">
        <h3 className="card-title">Журнал дисциплины</h3>

        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Группа</th>
              <th>Кадет</th>
              <th>Командир</th>
              <th>Тип</th>
              <th>Комментарий</th>
              <th>Дата</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.group_name}</td>
                <td>{r.cadet_name}</td>
                <td>{r.commander_name}</td>
                <td>{r.violation_type}</td>
                <td>{r.comment}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn-delete" onClick={() => removeRecord(r.id)}>
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
