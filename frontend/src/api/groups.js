import api from "./axios";

export async function getGroups() {
  const res = await api.get("/groups");
  return res.data;
}

export async function createGroup(payload) {
  const res = await api.post("/groups", payload);
  return res.data;
}

export async function getGroupMembers(groupId) {
  const res = await api.get(`/groups/${groupId}/members`);
  return res.data;
}

export async function addGroupMember(groupId, cadetId) {
  const res = await api.post(`/groups/${groupId}/members`, {
    group_id: groupId,
    cadet_id: cadetId,
  });
  return res.data;
}

export async function deleteGroupMember(memberId) {
  const res = await api.delete(`/groups/members/${memberId}`);
  return res.data;
}
export async function deleteGroup(id) {
  const res = await api.delete(`/groups/${id}`);
  return res.data;
}
