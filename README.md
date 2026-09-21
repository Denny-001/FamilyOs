# FamilyOS — Documentation

Central index for all FamilyOS documentation. If you're new here, start with **Architecture** → **Database** → **API**.

## 📚 Contents

| Section | What you'll find |
|---|---|
| [`api/`](./api/) | OpenAPI 3.1 spec and Postman collection for every endpoint |
| [`architecture/`](./architecture/) | High-level system design + data flow diagrams |
| [`database/`](./database/) | MongoDB schema reference and migration history |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | How to set up, branch, commit, and open a PR |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Shipping to Render, Vercel, MongoDB Atlas |

## 🗺️ Quick navigation

- **Just landed?** → [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Shipping?** → [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Integrating?** → [api/openapi.yaml](./api/openapi.yaml)
- **Understanding the system?** → [architecture/system_architecture.md](./architecture/system_architecture.md)
- **Looking at the data model?** → [database/schema.md](./database/schema.md)

## 🔖 Conventions

- All file paths in these docs are relative to the repo root.
- Code snippets are TypeScript unless marked otherwise.
- Environment variables are documented in `.env.example` at the root.
- Diagrams are Mermaid — view on GitHub or paste into [mermaid.live](https://mermaid.live).