import { api } from './api';

export const familyService = {
  create: (name: string) =>
    api.post('/families', { name }).then((r) => r.data.data),

  get: (familyId: string) =>
    api.get(`/families/${familyId}`).then((r) => r.data.data),

  members: (familyId: string) =>
    api.get(`/families/${familyId}/members`).then((r) => r.data.data),

  invite: (familyId: string, payload: Record<string, unknown>) =>
    api.post(`/families/${familyId}/invites`, payload).then((r) => r.data.data),

  join: (code: string, relationship?: string) =>
    api.post(`/families/join/${code}`, { relationship }).then((r) => r.data.data),
};