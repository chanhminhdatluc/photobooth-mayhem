# Roadmap

## Mandatory Vietnamese amendment

`LOCALIZATION.md` supersedes English-first and cents/USD rules. Phase 0–1 UI, metadata, accessibility labels, Phaser signs and app error pages now use a centralized Vietnamese catalog. Simulation emits localization keys. `vi-VN` number/date helpers and integer-VND balance defaults are implemented; economic transactions, NPC dialogue and incidents remain future work. No Phase 2 systems were introduced. Validation: typecheck, lint, 20 unit tests and production build passed; browser localization/regression results recorded in TESTING.md.

## Current phase: Phase 1 — complete locally; awaiting Phase 2 authorization

Phase 1 adds a fixed 8×8 shop, isometric projection/inverse hit testing, footprint collision, deterministic BFS shortest paths, continuous manager movement, safe mid-edge rerouting, ground-baseline depth ordering, booth inspection/approach, bounded drag camera and recenter control. Touch taps and desktop clicks share world-space targeting. No dependencies added. Verified: lint, type checking, 15 unit tests, production build, six production browser tests, and six development browser tests all passed.

Implemented files: Next.js/Tailwind shell, browser-only Phaser preview, responsive fixed-resolution canvas, renderer status/retry, lifecycle cleanup, deterministic clock/PRNG, test configuration, documentation, and environment example.

Verified October 27, 2026: fresh dependency installation, lockfile consistency dry-run, lint with no warnings, strict type check, eight unit tests, production build, four production browser tests and four development browser tests. Mobile screenshot reviewed. Production dependency audit reported zero known vulnerabilities. Initial incomplete installs and the JavaScript-disabled fallback failure were corrected. Development tests use port 3101 to avoid a production-test server shutdown race on port 3100.

## Not implemented

2. Customer/service/economy loop.
3. Three interactive incidents.
4. Progression, printer upgrade, financial reports.
5. Google OAuth and protected routes.
6. Cloud save, server command validation, RLS, resume.
7. Gameplay mobile optimization and real-device profiling.
8. Live Vercel deployment and production integration verification.

## Known limitations

- World prototype is public and playable for exploration only; it intentionally creates no save.
- Canvas rendering only; WebGL/context-loss handling is not exercised.
- Browser emulation is not proof of physical iPhone/Android behavior.
- No GitHub remote, credentials, Supabase project, or deployment configured.
- ESLint 9 compatibility choice needs a support review before production.

Stop after Phase 1. Phase 2 requires explicit authorization.