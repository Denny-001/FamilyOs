
### 📄 `docs/database/migrations/README.md`

```markdown
# FamilyOS — Database Migrations

MongoDB is schemaless, but **indexes are not**. This folder tracks every index or data-shape change applied to production.

## Rules

1. **One file per migration.** Name them `YYYYMMDD_short_description.md` or `.ts`.
2. **Idempotent.** Running twice must be safe.
3. **Reversible.** Each migration documents its rollback.
4. **Reviewed.** No direct writes to production — every change ships via a PR.
5. **Backfill first, index second.** Adding an index on a large collection locks writers; use `background: true` and roll out during off-peak.

## Process

```bash
# 1. Write the migration script
touch migrations/20260601_add_index_posts_pinned.ts

# 2. Dry-run against a staging cluster
MONGODB_URI=<staging> npx tsx migrations/20260601_add_index_posts_pinned.ts --dry-run

# 3. Apply to production
MONGODB_URI=<prod> npx tsx migrations/20260601_add_index_posts_pinned.ts --apply

# 4. Record in this folder's CHANGELOG (below)