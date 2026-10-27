# Testing

## Vietnamese amendment validation

Twenty unit tests passed, including five locale tests: default catalog, named parameters, VND formatting/safe integer validation, Vietnamese numbers/calendar dates, and message-key simulation boundary. Type checking, lint and production build passed. Browser tests now assert Vietnamese controls and comma-decimal positions; added locale/404 checks with an English browser locale and checks for legacy English UI phrases. Source scan found no remaining hardcoded player-facing JSX prose or English scene signs in app/components/game. Phrase scans are regression aids, not proof of complete linguistic review. Browser totals will be recorded after completion.

Future NPC, incident, finance, authentication and save localization acceptance remains pending implementation. App error pages are localized but error-boundary failure injection is not covered yet.

## Commands

Run npm scripts from the repository root (use `npm.cmd` on restricted PowerShell): `lint`, `typecheck`, `test`, `build`, `test:e2e`, and `test:e2e:dev`.

Install Chromium with `npx.cmd playwright install chromium`. Production E2E requires `build` first. The development configuration exercises Strict Mode. Production uses port 3100; development uses port 3101. Do not run build and type generation concurrently because both write Next's generated files.

## Phase 1 coverage

Seven additional unit tests cover inverse projection, tile picking, depth baselines, blocked cells/entrance, path adjacency, unreachable targets, continuous motion, rerouting, inspection arrival, invalid input and bounded suspension catch-up. Total: 15 unit tests.

The browser world journey runs on desktop and touch-emulated mobile: tap floor, observe walking/arrival, reject a blocked tile without teleporting, tap booth, arrive at its interaction point, close inspection, drag without moving the manager, recenter and tap again. Drag uses a mouse in both profiles; true touch-drag and OS touch cancellation require additional device verification. Production suite: six tests passed. Development suite: six tests passed, including preserved lifecycle tests. Screenshots captured and desktop shop image inspected. Lint, type checking, all 15 unit tests and production build passed.

## Preserved foundation coverage

- Vitest, Node environment: seeded determinism, PRNG bounds/state restore/invalid input, fixed steps, catch-up cap, reset, invalid clock input.
- Playwright, desktop and mobile Chromium: landing navigation, renderer-ready status, exactly one canvas, actual non-background rendered pixels, narrow/landscape overflow, repeated route mounts, reload, JavaScript-disabled SSR, browser runtime/console errors. Screenshots retained in test results.
- Strict TypeScript and Next ESLint rules.

## Results

Verified October 27, 2026:

- `lint`: passed, no warnings.
- `typecheck`: passed.
- `test`: eight passed.
- Production build: passed, both app pages prerendered without Phaser SSR errors.
- Production browser suite: four passed (desktop/mobile Chromium).
- Development browser suite: four passed, including Strict Mode navigation/remount.
- `npm ci --dry-run --ignore-scripts --no-audit --no-fund`: passed lockfile consistency validation (not a full clean-install test).
- `npm audit --omit=dev`: zero known vulnerabilities at execution time; not proof of overall security.
- Mobile screenshot inspected.

Initial incomplete dependency files were resolved with a fresh install; a Phaser Vector2 typing error and JavaScript-disabled fallback test were fixed. A concurrent typegen/build race was avoided by sequencing those checks. Separate browser-test ports avoid the observed shutdown race.

Not verified: physical devices, Safari/Firefox, long-duration performance, real OS suspension, WebGL context loss, or complete memory-leak profiling. Navigation tests assert visible canvas cleanup, not heap reclamation.

## Later mandatory coverage

Economy/machine/NPC/incident tests, server authorization and idempotency, save versions/conflicts, and authenticated full resume journey. None exist yet because the corresponding features do not exist. No mocked or live Supabase integration has been tested.