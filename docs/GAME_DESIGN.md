# Game design

## Mandatory locale and setting

See `LOCALIZATION.md`, which overrides English-first and USD/cents requirements throughout the master specification. Default `vi-VN`; fictional Vietnamese urban neighborhood inspired by Hanoi and Ho Chi Minh City; natural Vietnamese dialogue and non-explicit local humor. All future content must use centralized localization keys.

## Product goal

A cozy, chaotic, mobile-first isometric photobooth tycoon. Players prepare a shop, serve visibly walking customers, resolve consequential incidents, review daily finances, and buy meaningful upgrades.

## MVP targets (not implemented in Phase 0)

- 20,000,000 VND starting cash, one booth, no employees, reputation 50/100, level 1.
- Integer VND, typed transactions, no negative-cash purchases or duplicate rewards. Initial session 70,000 VND, repair 250,000 VND, printer upgrade 3,000,000 VND; centralized in economy configuration.
- Grid navigation, customer queues, single-capacity sessions, supplies, wear, and payment.
- Malfunction, theft attempt, and non-explicit conduct violation incidents.
- High-speed printer upgrade, XP, daily report, consecutive days.
- Google authentication, isolated server-backed saves, revision conflict handling, and resume.
- Configurable accelerated days targeting 4–8 minutes.

## Phase 1 interaction slice

Tap a walkable floor diamond to move the manager along a shortest cardinal route. Furniture and perimeter cells are blocked; the marked entrance is accessible. Tap the booth silhouette or use Inspect booth to select it and approach its adjacent interaction point. The inspection panel reports approach/arrival and can be dismissed. Drag to pan within bounds; Recenter view restores the full-shop view. No fake repair, upgrade, supply, or payment actions are shown. Reload intentionally resets this unsaved prototype.

## Phase 0 visual fixture (historical)

Original cream, pink, lavender, and mint booth illustration, drawn with Phaser graphics at a low internal resolution. No floor metadata, navigation, customer entities, economy, or interactions exist. The preview does not imply gameplay or persist progress.

## Next gate

Phase 2 introduces customers, queueing, machine sessions, equipment wear, and the economic day loop. Stop after Phase 1 until authorized.