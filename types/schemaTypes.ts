/**
 * FamilyOS — Zod validation schemas
 *
 * Every request body that hits the API is validated with one of these.
 * The client uses the same schemas with React Hook Form + `zodResolver`,
 * so validation rules are guaranteed to match on both sides.
 */

import { z } from 'zod';
import {
  ROLES,
  POST_TYPES,
  REACTION_TYPES,
  EVENT_TYPES,
  RSVP_STATUSES,
  TASK_STATUSES,
  PAYMENT_PROVIDERS,
  VAULT_ACCESS_LEVELS,
  VAULT_CATEGORIES,
  PASSWORD_MIN_LENGTH,
  NAME_MAX_LENGTH,
  POST_CONTENT_MAX_LENGTH,
  COMMENT_CONTENT_MAX_LENGTH,
  MEDIA_URLS_MAX,
  PAGINATION_DEFAULTS,
  INVITE_DEFAULTS,
  DEFAULT_CURRENCY,
} from './constants';

// ─────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────

/** E.164-compatible: optional +, then 2–15 digits. */
export const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format');

export const PhoneSchema = z
  .string()
  .trim()
  .regex(phoneRegex, 'Invalid phone number (use E.164, e.g. +254712345678)');

export const PasswordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(100, 'Password too long');

export const NameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(NAME_MAX_LENGTH, `Name must be at most ${NAME_MAX_LENGTH} characters`);

export const UrlSchema = z.string().url('Must be a valid URL');

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  name: NameSchema,
  phone: PhoneSchema,
  password: PasswordSchema,
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

export const LoginSchema = z.object({
  phone: PhoneSchema,
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  phone: PhoneSchema,
});

// ─────────────────────────────────────────────────────────────
// Families & Memberships
// ─────────────────────────────────────────────────────────────

export const CreateFamilySchema = z.object({
  name: z.string().trim().min(2, 'Family name too short').max(80, 'Family name too long'),
});

export const UpdateFamilySchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  coverPhotoUrl: UrlSchema.optional(),
  settings: z
    .object({
      currency: z.string().length(3).optional(),
      timezone: z.string().min(1).optional(),
    })
    .optional(),
});

export const InviteMemberSchema = z.object({
  role: z.enum(ROLES).default('adult'),
  relationship: z.string().trim().max(60).optional(),
  maxUses: z.number().int().positive().max(100).optional(),
  expiresInDays: z
    .number()
    .int()
    .positive()
    .max(90)
    .default(INVITE_DEFAULTS.expiresInDays),
});

export const JoinFamilySchema = z.object({
  relationship: z.string().trim().max(60).optional(),
});

export const UpdateMemberSchema = z.object({
  role: z.enum(ROLES).optional(),
  relationship: z.string().trim().max(60).optional(),
});

// ─────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(PAGINATION_DEFAULTS.page),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(PAGINATION_DEFAULTS.maxLimit)
    .default(PAGINATION_DEFAULTS.limit),
});

// ─────────────────────────────────────────────────────────────
// Feed — Posts, Comments, Reactions
// ─────────────────────────────────────────────────────────────

export const CreatePostSchema = z.object({
  type: z.enum(POST_TYPES),
  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(POST_CONTENT_MAX_LENGTH, 'Post too long'),
  mediaUrls: z.array(UrlSchema).max(MEDIA_URLS_MAX).optional(),
  eventId: objectIdSchema.optional(),
});

export const UpdatePostSchema = z.object({
  content: z.string().trim().min(1).max(POST_CONTENT_MAX_LENGTH).optional(),
  mediaUrls: z.array(UrlSchema).max(MEDIA_URLS_MAX).optional(),
});

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(COMMENT_CONTENT_MAX_LENGTH, 'Comment too long'),
  parentCommentId: objectIdSchema.optional(),
});

export const ReactionSchema = z.object({
  type: z.enum(REACTION_TYPES),
});

// ─────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────

export const EventLocationSchema = z.object({
  name: z.string().trim().max(120).optional(),
  address: z.string().trim().max(240).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

export const CreateEventSchema = z
  .object({
    title: z.string().trim().min(2).max(150),
    description: z.string().trim().max(3000).optional(),
    type: z.enum(EVENT_TYPES),
    startDate: z.string().datetime({ offset: true }),
    endDate: z.string().datetime({ offset: true }).optional(),
    location: EventLocationSchema.optional(),
    coverPhotoUrl: UrlSchema.optional(),
    contributionTarget: z.number().nonnegative().optional(),
    currency: z.string().length(3).default(DEFAULT_CURRENCY),
  })
  .refine(
    (data) => !data.endDate || new Date(data.endDate) >= new Date(data.startDate),
    { message: 'End date must be on or after start date', path: ['endDate'] }
  );

export const UpdateEventSchema = CreateEventSchema.partial();

export const RSVPSchema = z.object({
  status: z.enum(RSVP_STATUSES),
  guestCount: z.number().int().min(0).max(50).default(0),
});

// ─────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────

export const CreateTaskSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(2000).optional(),
  assignedTo: z.array(objectIdSchema).min(1, 'Assign to at least one person'),
  dueDate: z.string().datetime({ offset: true }).optional(),
  eventId: objectIdSchema.optional(),
});

export const UpdateTaskSchema = z.object({
  title: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().max(2000).optional(),
  assignedTo: z.array(objectIdSchema).min(1).optional(),
  dueDate: z.string().datetime({ offset: true }).optional(),
  status: z.enum(TASK_STATUSES).optional(),
});

// ─────────────────────────────────────────────────────────────
// Contributions & Payments
// ─────────────────────────────────────────────────────────────

export const SetContributionSchema = z.object({
  amountExpected: z.number().nonnegative('Amount must be zero or positive'),
});

export const PaymentInitSchema = z
  .object({
    contributionId: objectIdSchema,
    provider: z.enum(PAYMENT_PROVIDERS),
    phone: PhoneSchema.optional(),
  })
  .refine((data) => data.provider !== 'mpesa' || !!data.phone, {
    message: 'Phone number is required for M-Pesa payments',
    path: ['phone'],
  });

export const MpesaCallbackSchema = z.object({
  providerRef: z.string().min(1),
  status: z.enum(['success', 'failed']),
  amount: z.number().positive(),
  mpesaReceipt: z.string().optional(),
  phone: PhoneSchema.optional(),
});

// ─────────────────────────────────────────────────────────────
// Vault
// ─────────────────────────────────────────────────────────────

export const VaultUploadSchema = z.object({
  fileUrl: UrlSchema,
  fileName: z.string().trim().min(1).max(200),
  category: z.enum(VAULT_CATEGORIES).default('general'),
  accessLevel: z.enum(VAULT_ACCESS_LEVELS).default('adult'),
});

// ─────────────────────────────────────────────────────────────
// Derived TypeScript types
// ─────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export type CreateFamilyInput = z.infer<typeof CreateFamilySchema>;
export type UpdateFamilyInput = z.infer<typeof UpdateFamilySchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
export type JoinFamilyInput = z.infer<typeof JoinFamilySchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;

export type PaginationInput = z.infer<typeof PaginationSchema>;

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type ReactionInput = z.infer<typeof ReactionSchema>;

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type RSVPInput = z.infer<typeof RSVPSchema>;

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export type SetContributionInput = z.infer<typeof SetContributionSchema>;
export type PaymentInitInput = z.infer<typeof PaymentInitSchema>;
export type MpesaCallbackInput = z.infer<typeof MpesaCallbackSchema>;

export type VaultUploadInput = z.infer<typeof VaultUploadSchema>;