
---

## 📄 `docs/CONTRIBUTING.md`

```markdown
# Contributing to FamilyOS

Thanks for helping build FamilyOS. This guide covers local setup, branching, commit conventions, and PR expectations.

## 1. Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 20 LTS |
| npm | ≥ 10 |
| MongoDB Atlas | Free tier works |
| Git | ≥ 2.40 |

## 2. Initial Setup

```bash
# Clone
git clone <repo-url> familyos && cd familyos

# Install (workspaces)
npm install

# Configure environment
cp .env.example .env
# Fill in: MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET

# Seed dev data
npm run seed

# Start dev servers (client + server concurrently)
npm run dev