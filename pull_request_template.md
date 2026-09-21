<!--
  Thanks for opening a PR!
  Fill in the sections below. Delete anything that doesn't apply.
-->

## What

<!-- One-paragraph summary of the change. -->

## Why

<!-- Link the issue or explain the motivation. -->
Closes #

## Type

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `chore` — tooling, deps, build
- [ ] `docs` — documentation only
- [ ] `refactor` — no behavior change
- [ ] `perf` — performance improvement
- [ ] `test` — tests only

## Scope

- [ ] `client`
- [ ] `server`
- [ ] `shared`
- [ ] `scripts`
- [ ] `docs`
- [ ] `ci`

## How

<!--
  High-level implementation notes. What approach did you take?
  Anything the reviewer should specifically look at?
-->

## Screenshots

<!-- For any UI change — before/after screenshots or a short screen recording. -->

## Test plan

<!--
  What did you run locally? What did you observe?
  For any non-trivial logic, include the specific commands or clicks.
-->

- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] Manually tested in a browser
- [ ] Manually tested on mobile (Android Chrome)

## DB / migrations

<!--
  Any new indexes, schema changes, or data backfills?
  If yes, link the migration file and describe the rollback.
-->

- [ ] No DB changes
- [ ] Migration included → `docs/database/migrations/YYYYMMDD_*.ts`

## Security & privacy

<!-- Tick anything that applies. -->

- [ ] Touches authentication / authorization
- [ ] Touches payment flow
- [ ] Adds new env var(s) — updated `.env.example` and `docs/DEPLOYMENT.md`
- [ ] Changes vault access rules
- [ ] None of the above

## Rollback

<!-- How do we undo this if it breaks production? Deploy revert? Feature flag? DB rollback? -->

## Checklist

- [ ] Conventional Commit message (`feat(server): …`)
- [ ] No `console.log` left in shipped code
- [ ] No secrets committed
- [ ] Added/updated tests where behavior changed
- [ ] Updated docs if user-facing behavior changed
- [ ] PR is ≤ 400 lines changed (or explains why not)