import { api } from './api';

export const vaultService = {
  list: (familyId: string) => api.get(`/families/${familyId}/vault`).then((r) => r.data.data),

  upload: (familyId: string, payload: Record<string, unknown>) =>
    api.post(`/families/${familyId}/vault`, payload).then((r) => r.data.data),

  download: (id: string) => api.get(`/vault/${id}/download`).then((r) => r.data.data),

  remove: (id: string) => api.delete(`/vault/${id}`),
};