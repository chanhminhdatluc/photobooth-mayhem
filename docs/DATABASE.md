# Database — planned

Mandatory locale amendment: `LOCALIZATION.md`. Future money fields store integer VND with explicit units, not cents; API/database identifiers stay English. Persist timestamps and domain identifiers, not localized display strings.

No database connection, migrations, or tables exist in Phase 0. Do not interpret this design as implemented security.

Phase 5/6 will introduce Supabase Auth and PostgreSQL. MVP candidates are profiles, game_saves, accepted commands/transactions, and only the ownership tables justified by implemented gameplay.

Game saves require UUID ownership, one primary slot per user, schema version, revision, JSONB snapshot, and timestamps. All player-owned tables require RLS and explicit authenticated ownership policies. Signed-out access must be denied.

Server command processing must atomically check expected revision, enforce unique command IDs, compute authoritative mutations, append transaction records, and update the snapshot. Never use client-supplied owner IDs or financial state as authority. Test with two authenticated users before calling isolation verified.

SQL migrations will live under `supabase/migrations` once real schemas are implemented. Routine schema changes must be CLI-applied migrations, not undocumented dashboard edits.