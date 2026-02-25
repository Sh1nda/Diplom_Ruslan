import React, { useEffect, useState } from "react";
import { getGroups } from "../api/groups";
import { getDiscipline, createDiscipline, deleteDiscipline } from "../api/discipline";
import api from "../api/axios";

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
    const res = await api.get("/groups/" + groupId + "/members");
    // тут можно запросить подробные данные по кадетам, если нужно
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
    <div>
      <h2>Дисциплина</h2>

      <form onSubmit={submitRecord} style={{ marginBottom: 20 }}>
        <div>
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
              <option key={g.id} value={g.id}>
                #{g.id} {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Кадет</label>
          <select
            value={cadetId}
            onChange={(e) => setCadetId(e.target.value)}
            disabled={!groupId}
          >
            <option value="">Выберите кадета</option>
            {cadets.map((m) => (
              <option key={m.id} value={m.cadet_id}>
                #{m.cadet_id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Тип нарушения</label>
          <input
            value={violationType}
            onChange={(e) => setViolationType(e.target.value)}
          />
        </div>

        <div>
          <label>Комментарий</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button type="submit">Добавить запись</button>
      </form>

      <h3>Журнал дисциплины</h3>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Группа</th>
            <th>Кадет</th>
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
              <td>{r.group_id}</td>
              <td>{r.cadet_id}</td>
              <td>{r.violation_type}</td>
              <td>{r.comment}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>
                <button onClick={() => removeRecord(r.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
