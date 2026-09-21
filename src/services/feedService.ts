import { api } from './api';

export const feedService = {
  list: (familyId: string, page = 1) =>
    api.get(`/families/${familyId}/posts`, { params: { page } }).then((r) => r.data.data),

  create: (familyId: string, payload: { type: string; content: string; mediaUrls?: string[] }) =>
    api.post(`/families/${familyId}/posts`, payload).then((r) => r.data.data),

  remove: (familyId: string, postId: string) =>
    api.delete(`/families/${familyId}/posts/${postId}`),

  comments: (familyId: string, postId: string) =>
    api.get(`/families/${familyId}/posts/${postId}/comments`).then((r) => r.data.data),

  addComment: (familyId: string, postId: string, content: string) =>
    api.post(`/families/${familyId}/posts/${postId}/comments`, { content }).then((r) => r.data.data),

  react: (familyId: string, postId: string, type: string) =>
    api.post(`/families/${familyId}/posts/${postId}/reactions`, { type }).then((r) => r.data.data),
};