import { api } from './api';

export const eventService = {
  list: (familyId: string) =>
    api.get(`/families/${familyId}/events`).then((r) => r.data.data),

  create: (familyId: string, payload: Record<string, unknown>) =>
    api.post(`/families/${familyId}/events`, payload).then((r) => r.data.data),

  get: (id: string) => api.get(`/events/${id}`).then((r) => r.data.data),

  rsvp: (id: string, status: string, guestCount = 0) =>
    api.post(`/events/${id}/rsvp`, { status, guestCount }).then((r) => r.data.data),

  attendees: (id: string) =>
    api.get(`/events/${id}/attendees`).then((r) => r.data.data),
};