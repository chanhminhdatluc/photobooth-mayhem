# Edge-to-edge gameplay

The `/game` route is a fixed viewport, not a document-flow game card. `GameCanvas` owns an inset canvas host, passive floating HUD/hint layers, interactive action controls, and native modal bottom sheets. Only the game route locks document scrolling; teardown restores the prior overflow styles. `100vh`/`100dvh` provide CSS fallback; VisualViewport resize events also accommodate browser chrome and keyboard changes. These listeners and the existing ResizeObserver are disposed on unmount.

The canvas is never resized to accommodate menus. Native dialogs provide focus containment, Escape handling, background input blocking, and explicit close controls. Only panels scroll internally. Passive overlay containers have `pointer-events: none`; buttons opt back into pointer handling.

Camera framing shows a readable slice of the existing room at bounded 2.5–5 zoom instead of shrinking all shop bounds into the viewport. Pan converts screen deltas through zoom, clamps the world center, and records the center before resize. Resize preserves that center; recenter explicitly restores the default area. The existing map, furniture footprints, BFS, manager movement, render textures, and business simulation are retained.

HUD values come from actual business state. Cash is the configured in-session balance, not earned revenue. Reputation, customer NPCs, quest progression, authentication, and persistent saves do not exist yet. No fake tracker, reputation, saved confirmation, upgrades tab, or customer activity is introduced by this architecture change. The hint layer is not a Quest Engine. Business controls and zero-transaction day reports remain available inside the management sheet.

Acceptance coverage includes 360×800, 390×844, 430×932, 768×1024 and 1280×800: exact canvas viewport bounds, menu size invariance, no horizontal overflow, route scroll-lock cleanup, real movement/inspection/panning, simulation lifecycle, font loading, and JavaScript-disabled messaging. Browser emulation and screenshots do not establish physical-device keyboard, notch, or browser-toolbar behavior; those still require device testing. Native browser fullscreen mode and pinch zoom are not added.

## Local verification

Run `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd test`, and `npm.cmd run build`. Run production and development Playwright suites sequentially because production clears the shared result root. The scheduled-spawn browser case intentionally takes over 30 seconds and has a 45-second test timeout; use a background test process and separate stdout/stderr logs if the command runner imposes a 30-second limit.