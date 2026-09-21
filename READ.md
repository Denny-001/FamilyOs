# FamilyOS — Scripts

Utility scripts that run against the server's MongoDB models.

## Prerequisites

- `.env` at the repo root (copy from `.env.example`)
- MongoDB reachable at the `MONGODB_URI` value

## Commands

Run from the repo root via the root `package.json`, or from this folder directly.

### Seed a dev dataset

```bash
npm run seed              # idempotent — skips if already seeded
npm run seed:reset        # wipes + reseeds