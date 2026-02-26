import React, { useEffect, useState } from "react";
import { getAttendance, markAttendance } from "../api/attendance";
import { getSchedule } from "../api/schedule";
import { getGroups } from "../api/groups";
import { getGroupMembers } from "../api/groups"; // <-- используем твой файл
import "./AttendancePage.css";

export default function AttendancePage() {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");

  const [cadets, setCadets] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    setGroups(await getGroups());
  }

  async function loadDataForGroup(id) {
    if (!id) return;

    // Загружаем кадетов группы
    const members = await getGroupMembers(id);
    const cadets = members.map((m) => ({
      id: m.cadet_id,
      full_name: m.full_name,
    }));

    // Загружаем занятия группы
    const lessons = await getSchedule({ group_id: id });

    // Загружаем посещаемость
    const records = await getAttendance();

    const map = {};

    cadets.forEach((c) => {
      map[c.id] = {};
      lessons.forEach((l) => {
        const rec = records.find(
          (r) => r.cadet_id === c.id && r.schedule_item_id === l.id
        );
        map[c.id][l.id] = rec ? rec.present : false;
      });
    });

    setCadets(cadets);
    setLessons(lessons);
    setAttendance(map);
  }

  function toggle(cadetId, lessonId) {
    setAttendance((prev) => ({
      ...prev,
      [cadetId]: {
        ...prev[cadetId],
        [lessonId]: !prev[cadetId][lessonId],
      },
    }));
  }

  async function save() {
    for (const cadetId of Object.keys(attendance)) {
      for (const lessonId of Object.keys(attendance[cadetId])) {
        await markAttendance({
          schedule_item_id: Number(lessonId),
          cadet_id: Number(cadetId),
          present: attendance[cadetId][lessonId],
        });
      }
    }
    alert("Посещаемость сохранена");
  }

  return (
    <div className="attendance-container">
      <h2 className="page-title">Посещаемость по группам</h2>

      <div className="card">
        <select
          value={groupId}
          onChange={(e) => {
            const id = e.target.value;
            setGroupId(id);
            loadDataForGroup(id);
          }}
        >
          <option value="">Выберите группу</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {groupId && (
        <div className="card">
          <h3 className="card-title">Таблица посещаемости</h3>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Курсант</th>
                {lessons.map((l) => (
                  <th key={l.id}>
                    {l.course_name}
                    <br />
                    {new Date(l.start_time).toLocaleDateString()}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {cadets.map((c) => (
                <tr key={c.id}>
                  <td>{c.full_name}</td>

                  {lessons.map((l) => (
                    <td key={l.id} className="center">
                      <input
                        type="checkbox"
                        checked={attendance[c.id]?.[l.id] || false}
                        onChange={() => toggle(c.id, l.id)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn-primary save-btn" onClick={save}>
            Сохранить посещаемость
          </button>
        </div>
      )}
    </div>
  );
}
