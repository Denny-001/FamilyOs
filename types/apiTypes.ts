/**
 * FamilyOS — API request & response type definitions
 *
 * These mirror what the server actually returns. They do NOT include
 * Zod runtime validation — that lives in schemaTypes.ts.
 */

import type {
  Role,
  MembershipStatus,
  PostType,
  ReactionType,
  EventType,
  RSVPStatus,
  TaskStatus,
  ContributionStatus,
  PaymentProvider,
  PaymentStatus,
  VaultAccessLevel,
  VaultCategory,
  NotificationType,
} from './constants';

// ─────────────────────────────────────────────────────────────
// Generic envelopes
// ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ValidationErrorDetail {
  path: string;
  message: string;
}

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  expiresIn: number; // milliseconds
}

export interface AuthSession extends AuthTokens {
  user: PublicUser;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  email?: string;
}

export interface RefreshPayload {
  accessToken: string;
  expiresIn: number;
}

// ─────────────────────────────────────────────────────────────
// Users & Families
// ─────────────────────────────────────────────────────────────

export interface PublicUser {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  dateOfBirth?: string; // ISO
}

export interface FamilySummary {
  _id: string;
  name: string;
  slug: string;
  coverPhotoUrl?: string;
  memberCount?: number;
  role: Role;
}

export interface FamilyDetail {
  _id: string;
  name: string;
  slug: string;
  coverPhotoUrl?: string;
  createdBy: string;
  settings: {
    currency: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMember {
  _id: string;
  familyId: string;
  userId: PublicUser;
  role: Role;
  relationship?: string;
  status: MembershipStatus;
  joinedAt: string;
}

export interface InviteResponse {
  invite: {
    _id: string;
    code: string;
    roleOnJoin: Role;
    relationship?: string;
    expiresAt: string;
    maxUses?: number;
    usesCount: number;
  };
  joinUrl: string;
}

// ─────────────────────────────────────────────────────────────
// Feed
// ─────────────────────────────────────────────────────────────

export interface PostPayload {
  type: PostType;
  content: string;
  mediaUrls?: string[];
  eventId?: string;
}

export interface PostResponse {
  _id: string;
  familyId: string;
  authorId: PublicUser;
  type: PostType;
  content: string;
  mediaUrls: string[];
  pinned: boolean;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  _id: string;
  postId: string;
  authorId: PublicUser;
  content: string;
  parentCommentId?: string;
  createdAt: string;
}

export interface ReactionResponse {
  _id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────

export interface EventLocation {
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface EventPayload {
  title: string;
  description?: string;
  type: EventType;
  startDate: string; // ISO
  endDate?: string;
  location?: EventLocation;
  coverPhotoUrl?: string;
  contributionTarget?: number;
  currency?: string;
}

export interface EventResponse {
  _id: string;
  familyId: string;
  title: string;
  description?: string;
  type: EventType;
  startDate: string;
  endDate?: string;
  location?: EventLocation;
  coverPhotoUrl?: string;
  contributionTarget?: number;
  currency: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RSVPPayload {
  status: RSVPStatus;
  guestCount?: number;
}

export interface RSVPResponse {
  _id: string;
  eventId: string;
  userId: string | PublicUser;
  status: RSVPStatus;
  guestCount: number;
  respondedAt: string;
}

export interface RSVPSummary {
  yes: number;
  maybe: number;
  no: number;
  pending: number;
  totalGuests: number;
}

// ─────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────

export interface TaskPayload {
  title: string;
  description?: string;
  assignedTo: string[];
  dueDate?: string;
  eventId?: string;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  assignedTo?: string[];
  dueDate?: string;
  status?: TaskStatus;
}

export interface TaskResponse {
  _id: string;
  familyId: string;
  eventId?: string;
  title: string;
  description?: string;
  assignedTo: PublicUser[];
  dueDate?: string;
  status: TaskStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// Contributions & Payments
// ─────────────────────────────────────────────────────────────

export interface ContributionResponse {
  _id: string;
  familyId: string;
  eventId?: string;
  userId: PublicUser;
  amountExpected: number;
  amountPaid: number;
  currency: string;
  status: ContributionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitPayload {
  contributionId: string;
  provider: PaymentProvider;
  phone?: string; // required for mpesa
}

export interface PaymentResponse {
  _id: string;
  contributionId: string;
  provider: PaymentProvider;
  providerRef?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface MpesaCallbackPayload {
  providerRef: string;
  status: 'success' | 'failed';
  amount: number;
  mpesaReceipt?: string;
  phone?: string;
  raw?: unknown;
}

// ─────────────────────────────────────────────────────────────
// Vault
// ─────────────────────────────────────────────────────────────

export interface VaultDocumentResponse {
  _id: string;
  familyId: string;
  fileUrl: string;
  fileName: string;
  category: VaultCategory;
  accessLevel: VaultAccessLevel;
  uploadedBy: string;
  createdAt: string;
}

export interface VaultUploadPayload {
  fileUrl: string;
  fileName: string;
  category: VaultCategory;
  accessLevel: VaultAccessLevel;
}

// ─────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────

export interface NotificationResponse {
  _id: string;
  userId: string;
  familyId?: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// Socket.io events
// ─────────────────────────────────────────────────────────────

export interface SocketEventMap {
  'family:join': string;
  'family:leave': string;
  'post:new': { postId: string };
  'post:update': { postId: string };
  'post:delete': { postId: string };
  'rsvp:update': { eventId: string; userId: string; status: RSVPStatus };
  'task:update': { taskId: string };
  'task:delete': { taskId: string };
  'contribution:update': { contributionId: string };
  'notification:new': { notificationId: string };
}

// ─────────────────────────────────────────────────────────────
// Error codes (machine-readable)
// ─────────────────────────────────────────────────────────────

export const API_ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL: 'INTERNAL',
  INVITE_EXPIRED: 'INVITE_EXPIRED',
  INVITE_EXHAUSTED: 'INVITE_EXHAUSTED',
  PAYMENT_ALREADY_PAID: 'PAYMENT_ALREADY_PAID',
  PAYMENT_INIT_FAILED: 'PAYMENT_INIT_FAILED',
} as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];