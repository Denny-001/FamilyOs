/**
 * FamilyOS — Shared module barrel export
 *
 * Imported by both `client/` and `server/`:
 *
 *   import { ROLES, Role, RegisterSchema, slugify } from '@familyos/shared';
 *
 * Everything exported here must compile cleanly for both a browser
 * (ES2022 DOM) and Node 20 (ES2022) environment.
 */

// ─── Constants ──────────────────────────────────────────────
export * from './types/constants';

// ─── API types (request / response shapes) ──────────────────
export * from './types/apiTypes';

// ─── Zod schemas (runtime validation) ───────────────────────
export * from './types/schemaTypes';

// ─── Utilities ──────────────────────────────────────────────
export * from './utils/helpers';