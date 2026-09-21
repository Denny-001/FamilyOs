/**
 * FamilyOS — Shared constants
 *
 * Every enum-like value in the system lives here so client + server
 * can never drift. Each is exported both as a runtime `const` array
 * and as a TypeScript union type.
 */

// ─────────────────────────────────────────────────────────────
// Roles
// ─────────────────────────────────────────────────────────────

export const ROLES = ['owner', 'admin', 'adult', 'minor', 'guest'] as const;
export type Role = (typeof ROLES)[number];

/** Ascending privilege order — used by `isRoleAtLeast`. */
export const ROLE_HIERARCHY: readonly Role[] = [
  'guest',
  'minor',
  'adult',
  'admin',
  'owner',
] as const;

/** Human-readable labels for UI. */
export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  adult: 'Adult',
  minor: 'Minor',
  guest: 'Guest',
};

// ─────────────────────────────────────────────────────────────
// Membership status
// ─────────────────────────────────────────────────────────────

export const MEMBERSHIP_STATUSES = ['active', 'invited', 'removed'] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

// ─────────────────────────────────────────────────────────────
// Posts
// ─────────────────────────────────────────────────────────────

export const POST_TYPES = ['text', 'photo', 'video', 'announcement', 'emergency'] as const;
export type PostType = (typeof POST_TYPES)[number];

/** Post types that auto-pin above the chronological feed. */
export const PINNED_POST_TYPES: readonly PostType[] = ['announcement', 'emergency'] as const;

export const REACTION_TYPES = ['like', 'love', 'pray', 'laugh'] as const;
export type ReactionType = (typeof REACTION_TYPES)[number];

export const REACTION_EMOJI: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  pray: '🙏',
  laugh: '😂',
};

// ─────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────

export const EVENT_TYPES = [
  'birthday',
  'wedding',
  'funeral',
  'reunion',
  'graduation',
  'other',
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  birthday: 'Birthday',
  wedding: 'Wedding',
  funeral: 'Funeral',
  reunion: 'Reunion',
  graduation: 'Graduation',
  other: 'Other',
};

// ─────────────────────────────────────────────────────────────
// RSVP
// ─────────────────────────────────────────────────────────────

export const RSVP_STATUSES = ['yes', 'maybe', 'no', 'pending'] as const;
export type RSVPStatus = (typeof RSVP_STATUSES)[number];

export const RSVP_LABELS: Record<RSVPStatus, string> = {
  yes: 'Going',
  maybe: 'Maybe',
  no: "Can't make it",
  pending: 'Not responded',
};

// ─────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To-Do',
  in_progress: 'In Progress',
  done: 'Done',
};

// ─────────────────────────────────────────────────────────────
// Contributions & Payments
// ─────────────────────────────────────────────────────────────

export const CONTRIBUTION_STATUSES = ['pending', 'partial', 'paid'] as const;
export type ContributionStatus = (typeof CONTRIBUTION_STATUSES)[number];

export const PAYMENT_PROVIDERS = ['mpesa', 'card', 'cash', 'bank'] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const PAYMENT_STATUSES = ['initiated', 'success', 'failed'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// ─────────────────────────────────────────────────────────────
// Vault
// ─────────────────────────────────────────────────────────────

export const VAULT_ACCESS_LEVELS = ['owner', 'admin', 'adult', 'all'] as const;
export type VaultAccessLevel = (typeof VAULT_ACCESS_LEVELS)[number];

export const VAULT_CATEGORIES = [
  'legal',
  'medical',
  'financial',
  'photos',
  'identity',
  'general',
] as const;
export type VaultCategory = (typeof VAULT_CATEGORIES)[number];

// ─────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────

export const NOTIFICATION_TYPES = [
  'post.new',
  'post.emergency',
  'comment.new',
  'reaction.new',
  'rsvp.update',
  'event.reminder',
  'event.countdown',
  'task.assigned',
  'task.reminder',
  'contribution.set',
  'payment.success',
  'payment.failed',
  'member.joined',
  'vault.uploaded',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

// ─────────────────────────────────────────────────────────────
// Socket.io event names
// ─────────────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  FAMILY_JOIN: 'family:join',
  FAMILY_LEAVE: 'family:leave',
  POST_NEW: 'post:new',
  POST_UPDATE: 'post:update',
  POST_DELETE: 'post:delete',
  RSVP_UPDATE: 'rsvp:update',
  TASK_UPDATE: 'task:update',
  TASK_DELETE: 'task:delete',
  CONTRIBUTION_UPDATE: 'contribution:update',
  NOTIFICATION_NEW: 'notification:new',
} as const;
export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

// ─────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────

export const DEFAULT_CURRENCY = 'KES';
export const DEFAULT_TIMEZONE = 'Africa/Nairobi';

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 50,
} as const;

export const INVITE_DEFAULTS = {
  expiresInDays: 14,
  codeLength: 8,
} as const;

export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MAX_LENGTH = 80;
export const POST_CONTENT_MAX_LENGTH = 5000;
export const COMMENT_CONTENT_MAX_LENGTH = 2000;
export const MEDIA_URLS_MAX = 10;