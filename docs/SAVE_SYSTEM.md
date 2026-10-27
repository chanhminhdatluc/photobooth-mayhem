# Save system — planned

Mandatory locale amendment: `LOCALIZATION.md`. Future saves store integer VND and stable domain/message identifiers, never formatted currency or translated prose. Save/error/status UI must be Vietnamese. There is no existing financial save data to migrate.

Phase 0 has **no save system**. The preview creates no progress and explicitly says it is not saved. No localStorage currency or fake saved status exists.

Phase 6 must implement runtime-validated versioned snapshots, explicit migrations, one primary slot per authenticated user, optimistic revision checks, command idempotency, and transactional server processing.

Important commands trigger persistence; periodic checkpoints are batched, never frame-driven. Only a server-confirmed write permits a Saved indicator. On failure, show an actionable status and preserve a recoverable non-authoritative local checkpoint where possible. A stale revision must never silently overwrite another device.

Resume tests must cover earned money, a purchased upgrade, day settlement, browser closure/new session, and restoration. Doubled external services can verify client flows but cannot prove live OAuth, RLS, cross-device persistence, or database transactions.

Before implementing the client economy, define reward validation and any remaining anti-cheat limits. Browser simulation alone cannot be trusted to award arbitrary money or elapsed time.