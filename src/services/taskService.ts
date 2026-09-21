import { api } from './api';

export const taskService = {
  list: (familyId: string, filter?: { eventId?: string; status?: string }) =>
    api.get(`/families/${familyId}/tasks`, { params: filter }).then((r) => r.data.data),

  create: (familyId: string, payload: Record<string, unknown>) =>
    api.post(`/families/${familyId}/tasks`, payload).then((r) => r.data.data),

  update: (id: string, payload: Record<string, unknown>) =>
    api.patch(`/tasks/${id}`, payload).then((r) => r.data.data),

  remove: (id: string) => api.delete(`/tasks/${id}`),
};