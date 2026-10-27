# Deployment

## Phase 0 local preparation

Use Node 24.x, `npm ci`, `npm run build`, and `npm start`. The app uses standard Next.js output, no custom long-running backend, no filesystem persistence, and no required environment variables. Git is local; no remote or deployment has been created.

## Vercel (not performed)

1. Review the repository and ensure secrets/local logs are ignored.
2. Create the intended GitHub repository and push only after reviewing changes.
3. Import into Vercel with the Next.js preset and Node 24.x.
4. Use the package-lock install and standard build scripts.
5. Verify the resulting real URL on desktop and mobile; do not infer deployment success from a local build.

## Later Supabase / Google setup gate

No credentials are needed until Phase 5. At that point configure the public Supabase project URL and publishable key in local and Vercel environments. Keep Google client secrets in the provider configuration, not the browser bundle. Configure a Google OAuth web client, consent screen/test users as applicable, and the callback URI shown by Supabase's Google provider. Enable that provider in Supabase. Add the app's exact local and production callback routes to allowed redirects and set the production Site URL. Document exact implemented callback paths when they exist; do not assume placeholder routes work.

Phase 6 adds migration/CLI instructions when schema files exist. Production is blocked until RLS, owner checks, atomic revisions, real OAuth, and the critical resume journey are tested.

## Smoke checklist

- Home and preview load without SSR or browser errors.
- Canvas fits portrait/landscape, one instance after navigation/reload.
- No privileged secrets in browser assets.
- Later: sign-in/out, protected-route denial, new game, money/upgrade/day completion, confirmed save, browser restart and restored progress.
- Later: second-user isolation, stale-tab rejection, and failed-save messaging.

No live deployment or external integration is claimed by this repository's Phase 0 preview.