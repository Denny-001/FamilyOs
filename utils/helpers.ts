/**
 * FamilyOS — Shared utility functions
 *
 * Must be safe in both browser and Node 20. No DOM, no fs, no Node APIs.
 */

import { ROLE_HIERARCHY, type Role } from '../types/constants';

// ─────────────────────────────────────────────────────────────
// Strings
// ─────────────────────────────────────────────────────────────

export const slugify = (text: string): string =>
  text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Generate a human-friendly invite code.
 * Excludes 0/O/1/I/L to avoid confusion when read aloud.
 */
export const generateCode = (length = 8): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const truncate = (str: string, len = 100): string =>
  str.length > len ? `${str.slice(0, len).trimEnd()}…` : str;

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const initials = (name: string, max = 2): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, max)
    .join('');

// ─────────────────────────────────────────────────────────────
// Roles
// ─────────────────────────────────────────────────────────────

export const isRoleAtLeast = (role: Role, minimum: Role): boolean =>
  ROLE_HIERARCHY.indexOf(role) >= ROLE_HIERARCHY.indexOf(minimum);

export const canManageMembers = (role: Role): boolean => isRoleAtLeast(role, 'admin');
export const canPost = (role: Role): boolean => isRoleAtLeast(role, 'adult');
export const canSeeFinancials = (role: Role): boolean => isRoleAtLeast(role, 'adult');
export const canAccessVault = (role: Role, level: string): boolean => {
  if (role === 'owner') return true;
  if (role === 'admin') return level !== 'owner';
  if (role === 'adult') return level === 'adult' || level === 'all';
  return level === 'all';
};

// ─────────────────────────────────────────────────────────────
// Currency & Numbers
// ─────────────────────────────────────────────────────────────

export const formatCurrency = (amount: number, currency = 'KES'): string => {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
};

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-KE').format(n);

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const percentage = (part: number, whole: number): number =>
  whole === 0 ? 0 : clamp((part / whole) * 100, 0, 100);

// ─────────────────────────────────────────────────────────────
// Dates
// ─────────────────────────────────────────────────────────────

export const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions): string =>
  new Date(iso).toLocaleDateString('en-KE', opts ?? {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export const formatRelative = (iso: string, now: Date = new Date()): string => {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const secs = Math.round(diffMs / 1000);
  const mins = Math.round(secs / 60);
  const hours = Math.round(mins / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(secs) < 45) return 'just now';
  if (Math.abs(mins) < 60) return secs < 0 ? `in ${Math.abs(mins)}m` : `${Math.abs(mins)}m ago`;
  if (Math.abs(hours) < 24) return hours < 0 ? `in ${Math.abs(hours)}h` : `${Math.abs(hours)}h ago`;
  if (Math.abs(days) < 7) return days < 0 ? `in ${Math.abs(days)}d` : `${Math.abs(days)}d ago`;
  return formatDate(iso);
};

export const isOverdue = (dueDateIso: string | undefined, now: Date = new Date()): boolean =>
  !!dueDateIso && new Date(dueDateIso).getTime() < now.getTime();

export const hoursUntil = (iso: string, now: Date = new Date()): number =>
  (new Date(iso).getTime() - now.getTime()) / (1000 * 60 * 60);

// ─────────────────────────────────────────────────────────────
// Collections
// ─────────────────────────────────────────────────────────────

export const groupBy = <T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> =>
  items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);

export const uniqueBy = <T, K>(items: T[], keyFn: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const sortBy = <T>(items: T[], keyFn: (item: T) => number | string, dir: 'asc' | 'desc' = 'asc'): T[] => {
  const copy = [...items];
  copy.sort((a, b) => {
    const av = keyFn(a);
    const bv = keyFn(b);
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
  return copy;
};

// ─────────────────────────────────────────────────────────────
// Async
// ─────────────────────────────────────────────────────────────

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const retry = async <T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 500
): Promise<T> => {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await sleep(delayMs * Math.pow(2, i));
    }
  }
  throw lastErr;
};

// ─────────────────────────────────────────────────────────────
// Safe object access
// ─────────────────────────────────────────────────────────────

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> =>
  keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const copy = { ...obj };
  for (const key of keys) delete copy[key];
  return copy as Omit<T, K>;
};

// ─────────────────────────────────────────────────────────────
// Validation helpers (lightweight — full validation via Zod)
// ─────────────────────────────────────────────────────────────

export const isValidPhone = (phone: string): boolean =>
  /^\+?[1-9]\d{1,14}$/.test(phone);

export const isValidObjectId = (id: string): boolean =>
  /^[a-fA-F0-9]{24}$/.test(id);

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};