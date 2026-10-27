# Architecture

## Mandatory localization boundary

See `LOCALIZATION.md`. Vietnamese (`vi-VN`) is the default. All current player-facing strings live in `lib/i18n/vi-VN.ts`; typed lookup/interpolation and number, integer-VND, date formatting are shared by React and Phaser. World state emits stable message keys, never translated prose. Internal identifiers remain English. No localization dependency was added. Economy configuration defines future VND balance defaults, not a working economy.

## Phase 1 world architecture

The active scene is now `ShopScene`; `BootstrapScene` is retained as the original renderer fixture, not loaded during gameplay. `game/isometric/projection.ts` separates grid and screen coordinates. `game/world/shop.ts` owns the fixed map, blocked furniture footprints, entrance and interaction point. `navigation.ts` uses uniform-cost breadth-first search; `WorldModel` owns continuous movement and selection independently of Phaser. A typed bridge publishes changed views to React and accepts inspection/dismiss/recenter commands. Phaser owns drawing, camera offsets, and pointer gesture interpretation. React never drives a per-frame render loop.

Furniture uses single-tile footprints and a shared ground-contact depth baseline. Larger furniture would need split occlusion primitives or footprint-aware ordering before it is introduced. Artwork remains original code-drawn graphics, not a production sprite atlas. Movement is linear delta-based with bounded catch-up; fixed-step clock utilities remain available for Phase 2 simulation. Drag gestures never issue movement commands. Touch cancellation clears the gesture; pinch zoom is deferred because the fixed shop fits the viewport.

## Preserved Phase 0 foundation (historical)

- Next.js App Router: server-rendered landing and preview pages.
- React client boundary: `GameCanvas` owns the asynchronous Phaser import, a per-effect mount, resize observation, visibility listener, error UI, and teardown.
- Phaser 4.2.1: Canvas renderer with a fixed 360×420 backing buffer, FIT scaling, pixel rendering, no audio or network-loaded assets. This is intentionally a renderer fixture, not an isometric world engine.
- Readiness follows the first POST_RENDER event, not merely construction of a canvas.
- Teardown requests Phaser destruction with reusable plugins, wakes a sleeping loop so deferred teardown can run, removes observers/listeners and detaches the owned mount. Strict Mode cancellation prevents late imports from creating abandoned instances.
- Framework-independent seeded PRNG and fixed-step clock are unit tested. They are foundation utilities, not yet integrated into a simulation.
- UI copy was initially inline; the Vietnamese amendment now centralizes it in a typed localization layer.

## Planned boundaries, not implemented

`game/core` and domain systems own serializable state and deterministic commands. Phaser scenes consume state and emit input intents; React owns accessible management panels. Authentication never enters simulation code.

Server Route Handlers derive ownership from the authenticated session, validate commands, and process accepted persistent mutations atomically. Supabase PostgreSQL holds revisions, ownership, and snapshots. No standing backend loop, filesystem saves, or frame-by-frame requests.

Zustand, Supabase clients, runtime payload validation, economy systems, and cloud saves are intentionally deferred until their phases.

## Dependency decisions

Registry metadata and installed Phaser types were inspected. TypeScript 7 conflicted with typescript-eslint's supported compiler range, so TypeScript 6.0.3 is selected. Exact versions and the npm lockfile define the installed dependency tree. ESLint 9 is currently used for compatibility with Next's plugin set; review its support status before production.