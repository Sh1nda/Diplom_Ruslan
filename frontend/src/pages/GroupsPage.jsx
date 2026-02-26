import React, { useEffect, useState } from "react";
import {
  getGroups,
  createGroup,
  getGroupMembers,
  addGroupMember,
  deleteGroupMember,
  deleteGroup,
} from "../api/groups";
import api from "../api/axios";
import "./GroupsPage.css";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const [cadets, setCadets] = useState([]);
  const [commanders, setCommanders] = useState([]);

  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [commanderId, setCommanderId] = useState("");

  const [newCadetId, setNewCadetId] = useState("");

  useEffect(() => {
    loadGroups();
    loadCadets();
    loadCommanders();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      loadMembers(selectedGroupId);
    } else {
      setMembers([]);
    }
  }, [selectedGroupId]);

  async function loadGroups() {
    const data = await getGroups();
    setGroups(data);
  }

  async function loadCadets() {
    const res = await api.get("/users", { params: { role: "CADET" } });
    setCadets(res.data);
  }

  async function loadCommanders() {
    const res = await api.get("/users", { params: { role: "COMMANDER" } });
    setCommanders(res.data);
  }

  async function loadMembers(groupId) {
    const data = await getGroupMembers(groupId);
    setMembers(data);
  }

  async function submitGroup(e) {
    e.preventDefault();
    const payload = {
      name,
      year: year ? Number(year) : null,
      commander_id: commanderId ? Number(commanderId) : null,
    };
    await createGroup(payload);
    setName("");
    setYear("");
    setCommanderId("");
    await loadGroups();
  }

  async function submitAddMember(e) {
    e.preventDefault();
    if (!selectedGroupId || !newCadetId) return;
    await addGroupMember(selectedGroupId, Number(newCadetId));
    setNewCadetId("");
    await loadMembers(selectedGroupId);
  }

  async function removeMember(memberId) {
    await deleteGroupMember(memberId);
    await loadMembers(selectedGroupId);
  }

  async function removeGroup(id) {
    await deleteGroup(id);

    if (selectedGroupId === id) {
      setSelectedGroupId(null);
      setMembers([]);
    }

    await loadGroups();
  }

  return (
    <div className="groups-container">
      <h2 className="page-title">Учебные группы</h2>

      <div className="groups-layout">
        {/* Левая колонка */}
        <div className="left-column">
          <div className="card">
            <h3 className="card-title">Создать группу</h3>

            <form onSubmit={submitGroup} className="form-grid">
              <div className="form-field">
                <label>Название</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="form-field">
                <label>Год набора</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Командир (опционально)</label>
                <select
                  value={commanderId}
                  onChange={(e) => setCommanderId(e.target.value)}
                >
                  <option value="">Без командира</option>
                  {commanders.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary form-submit">
                Создать
              </button>
            </form>
          </div>

          <div className="card">
            <h3 className="card-title">Список групп</h3>

            <ul className="group-list">
              {groups.map((g) => (
                <li
                  key={g.id}
                  className={
                    g.id === selectedGroupId ? "group-item active" : "group-item"
                  }
                >
                  <span onClick={() => setSelectedGroupId(g.id)}>
                    {g.name} {g.year && `(${g.year})`}
                  </span>

                  <button
                    className="btn-delete small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGroup(g.id);
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="right-column">
          <div className="card">
            <h3 className="card-title">Состав группы</h3>

            {selectedGroupId ? (
              <>
                <form onSubmit={submitAddMember} className="form-grid">
                  <div className="form-field">
                    <label>Добавить кадета</label>
                    <select
                      value={newCadetId}
                      onChange={(e) => setNewCadetId(e.target.value)}
                    >
                      <option value="">Выберите кадета</option>
                      {cadets.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn-primary form-submit">
                    Добавить
                  </button>
                </form>

                <table className="styled-table" style={{ marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Кадет</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.cadet_id}</td>
                        <td>{m.full_name}</td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => removeMember(m.id)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p>Выберите группу слева</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
