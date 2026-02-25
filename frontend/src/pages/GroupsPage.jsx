import React, { useEffect, useState } from "react";
import { getGroups, createGroup, getGroupMembers, addGroupMember, deleteGroupMember } from "../api/groups";
import api from "../api/axios";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const [cadets, setCadets] = useState([]);

  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [commanderId, setCommanderId] = useState("");

  const [newCadetId, setNewCadetId] = useState("");

  useEffect(() => {
    loadGroups();
    loadCadets();
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

  return (
    <div>
      <h2>Учебные группы</h2>

      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <h3>Создать группу</h3>
          <form onSubmit={submitGroup}>
            <div>
              <label>Название</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label>Год набора</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div>
              <label>ID командира (опционально)</label>
              <input
                type="number"
                value={commanderId}
                onChange={(e) => setCommanderId(e.target.value)}
              />
            </div>
            <button type="submit">Создать</button>
          </form>

          <h3 style={{ marginTop: 30 }}>Список групп</h3>
          <ul>
            {groups.map((g) => (
              <li
                key={g.id}
                style={{
                  cursor: "pointer",
                  fontWeight: g.id === selectedGroupId ? "bold" : "normal",
                }}
                onClick={() => setSelectedGroupId(g.id)}
              >
                #{g.id} {g.name} {g.year && `(${g.year})`}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Состав группы</h3>
          {selectedGroupId ? (
            <>
              <form onSubmit={submitAddMember}>
                <div>
                  <label>Добавить кадета</label>
                  <select
                    value={newCadetId}
                    onChange={(e) => setNewCadetId(e.target.value)}
                  >
                    <option value="">Выберите кадета</option>
                    {cadets.map((c) => (
                      <option key={c.id} value={c.id}>
                        #{c.id} {c.username}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Добавить</button>
                </div>
              </form>

              <table style={{ marginTop: 20, width: "100%" }}>
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
                      <td>{m.cadet_id}</td>
                      <td>
                        <button onClick={() => removeMember(m.id)}>Удалить</button>
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
  );
}
