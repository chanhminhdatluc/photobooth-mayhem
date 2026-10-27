# Photobooth Mayhem

## Vietnamese-first requirement

The public prototype is “Tiệm Ảnh Bất Ổn” and defaults to `vi-VN`, including canvas signs, accessibility labels and app error pages. `docs/LOCALIZATION.md` is the mandatory master-specification amendment: Vietnamese cultural setting, centralized typed messages, integer VND, and Vietnamese number/date formatting across all phases. Code and technical documentation remain English. Current economy values are configuration only; no financial gameplay has been added. Enter using **Vào thăm tiệm**.

Mobile-first photobooth business simulation, built incrementally. **Current scope: Phase 1 playable world, not the full business-simulation MVP.** Walk the manager through a collision-aware isometric shop, select the booth, and inspect it. No customers, accounts, economy, or persistent progress exist yet.

## Prerequisites and installation

- Node.js 24.x and npm 11 or compatible; Git.
- Windows PowerShell: use `npm.cmd` / `npx.cmd` if script execution blocks the PowerShell launchers. No execution-policy changes are necessary.
- From the repository root: `npm.cmd ci`.
- Browser tests: `npx.cmd playwright install chromium`.

## Local development

Run `npm.cmd run dev` and open the local address printed by Next.js. `/` describes the project; `/game` is an explicitly public, unsaved renderer preview. It will be protected when authentication is implemented. Phaser is imported only from a client effect, never evaluated by server rendering.

## Environment

No environment variables are required for Phase 0. `.env.example` documents future public Supabase URL and publishable-key variables. Do not add privileged credentials to public variables or Git. Copy it to `.env.local` only when configuring later phases.

## Checks

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run test:e2e:dev
```

Production browser tests require a completed build. Test servers use port 3100 (production) and 3101 (development), and refuse to reuse an existing server. Run build and typecheck sequentially. Browser traces/screenshots live in ignored test output directories. Phase 0 validation passed: eight unit tests, four production browser tests, four development browser tests, lint, type checking, and production build; see `docs/TESTING.md` for limitations.

## Production

`npm.cmd run build` then `npm.cmd start`. Vercel should use its Next.js preset and Node 24.x. No deployment has been performed. See `docs/DEPLOYMENT.md` for setup and smoke checks.

## Database and authentication

Not implemented in Phase 0. No SQL migrations need applying yet, and no login button falsely claims authentication works. See `docs/DATABASE.md`, `docs/SAVE_SYSTEM.md`, and `docs/DEPLOYMENT.md` for the planned trust boundary and later setup gates.

## Design and documentation

- `docs/ARCHITECTURE.md`: boundaries and rendering lifecycle.
- `docs/GAME_DESIGN.md`: gameplay goals and scope.
- `docs/ROADMAP.md`: accurate implementation status.
- `docs/TESTING.md`: test coverage and limitations.

The bootstrap artwork is original code-drawn placeholder art. No external sprites, fonts, tracking, API services, or AI calls are used. The Phaser dependency retains its upstream license. Repository code/art have no distribution license assigned yet; choose one before publishing for reuse.