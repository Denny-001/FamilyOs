import { api } from './api';

export const contributionService = {
  listForEvent: (familyId: string, eventId: string) =>
    api.get(`/families/${familyId}/events/${eventId}/contributions`).then((r) => r.data.data),

  setForEvent: (familyId: string, eventId: string, amountExpected: number) =>
    api.post(`/families/${familyId}/events/${eventId}/contributions`, { amountExpected }),

  initiatePayment: (payload: { contributionId: string; provider: string; phone?: string }) =>
    api.post('/payments/initiate', payload).then((r) => r.data.data),
};