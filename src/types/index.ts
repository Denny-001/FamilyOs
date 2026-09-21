export interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
}

export interface Family {
  _id: string;
  name: string;
  slug: string;
  coverPhotoUrl?: string;
  settings: { currency: string; timezone: string };
}

export interface Post {
  _id: string;
  familyId: string;
  authorId: User;
  type: 'text' | 'photo' | 'video' | 'announcement' | 'emergency';
  content: string;
  mediaUrls: string[];
  pinned: boolean;
  createdAt: string;
}

export interface EventItem {
  _id: string;
  familyId: string;
  title: string;
  type: string;
  startDate: string;
  endDate?: string;
  location?: { name?: string; address?: string };
}

export interface TaskItem {
  _id: string;
  familyId: string;
  title: string;
  description?: string;
  assignedTo: User[];
  dueDate?: string;
  status: 'todo' | 'in_progress' | 'done';
}