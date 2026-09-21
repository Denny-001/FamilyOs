# `.github/` — GitHub automation for FamilyOS

Everything in this folder is consumed by GitHub automatically.

## Workflows

| File | Trigger | Purpose |
|---|---|---|
| `workflows/lint.yml` | PR + push to `main` | ESLint across `client/` and `server/` |
| `workflows/test.yml` | PR + push to `main` | Vitest with an ephemeral MongoDB service |
| `workflows/deploy.yml` | Push to `main` (after tests pass) | Trigger Render + Vercel deploy hooks, then smoke test |
| `workflows/codeql.yml` | PR + weekly cron | Static security analysis via CodeQL |

## Required GitHub Secrets

Set these in **Settings → Secrets and variables → Actions**:

| Secret | Used by | Purpose |
|---|---|---|
| `RENDER_DEPLOY_HOOK` | `deploy.yml` | Triggers the API redeploy |
| `VERCEL_DEPLOY_HOOK` | `deploy.yml` | Triggers the frontend redeploy |
| `SLACK_WEBHOOK` | `deploy.yml` | Posts failure notifications (optional) |

## Branches

- `main` — always deployable. Protected: requires a PR, at least one review, and all checks green.
- Feature branches — `feat/`, `fix/`, `chore/` (see `docs/CONTRIBUTING.md`).

## Templates

- **PRs** use `pull_request_template.md` (auto-populated).
- **Issues** use one of the templates in `ISSUE_TEMPLATE/`. Blank issues are disabled.
- **Security** issues go to `security@familyos.app`, not the tracker.

## Code owners

See `CODEOWNERS`. Reviewers are required for anything under `/server/src/middlewares/`,
`/server/src/controllers/auth/`, and `/server/src/services/payment/`.

## Dependabot

Runs weekly on Monday 04:00 EAT. Minor + patch bumps of the same stack are grouped
into a single PR to reduce noise. Major version bumps come as individual PRs so they
get full review.