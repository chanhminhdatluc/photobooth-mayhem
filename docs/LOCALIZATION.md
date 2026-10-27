# Mandatory specification amendment: Vietnamese primary language

This amendment supersedes the master specification's English-first language, USD balance values and cents-based currency representation. All gameplay, architecture, mobile-first, security, authentication, cloud-save and incremental delivery requirements remain mandatory. Applies retroactively to Phase 0 and every subsequent phase.

## Language and setting

Default and primary locale: `vi-VN`, regardless of browser language. Every player-facing menu, navigation item, authentication screen, HUD, setting, dialogue, speech bubble, incident, choice, consequence, upgrade, equipment description, financial report, tutorial, notification, achievement, mission, error and save status must be Vietnamese. No English placeholder fallback is permitted. Proper technology/provider names such as Google and JavaScript are not placeholder prose. Public display title: “Tiệm Ảnh Bất Ổn”; internal project identity remains Photobooth Mayhem.

The setting is a fictional Vietnamese urban neighborhood inspired by modern Hanoi and Ho Chi Minh City photobooth shops. Use Vietnamese names and natural conversational humor, not literal English translations. Approved examples for future NPC content:

- “Anh ơi, máy này nuốt tiền em rồi!”
- “Ủa, sao chụp 4 tấm mà mặt em méo hết vậy?”
- “Chủ quán đâu? Có đứa đang tháo đồ trang trí kìa!”
- “Tụi em mới chụp có 30 phút thôi mà!”
- “Anh ơi, giảm giá cho sinh viên đi mà!”

## Economy

All monetary state, commands, ledger entries and snapshots use integer VND, not cents or floating-point money. Use explicitly named English fields such as `cashVnd`, `revenueVnd`, and `supplyCostVnd`; validate safe-integer bounds server-side when economy commands exist. Format only at the presentation boundary. Starting configurable defaults: capital 20,000,000 VND; session 70,000 VND; printer repair 250,000 VND; upgrade 3,000,000 VND. These values are balance defaults, not implemented transactions. No existing financial saves require migration.

## Incident content roadmap

Future scenarios: customers taking “7749” poses without leaving; a couple arguing; accessory theft; machine vandalism; excessive intimacy; refund demands over unflattering photos; a surprise TikToker; printer paper running out during a rush; queue jumping and arguments; a boisterous student group. Sensitive situations remain non-explicit. Preserve safe nonviolent responses and bounded consequences. The original three-incident MVP gate remains malfunction, theft and conduct violation; this amendment does not authorize implementing all scenarios at once.

## Architecture

`lib/i18n/vi-VN.ts` owns current UI/scene messages. Stable English keys and typed named interpolation permit future catalogs with the same key contract. Missing keys/parameters are programming errors, never English player-facing fallbacks. `WorldModel` emits keys, not prose. React and Phaser translate at presentation boundaries. Future dialogues/events must use centralized catalog files as well. Code, database fields, APIs, identifiers and technical documentation stay English.

`Intl` helpers use `vi-VN`, VND with zero fractional digits, and explicit `Asia/Ho_Chi_Minh` timezone for calendar dates. Do not localize stored timestamps or serialize formatted money. Full Unicode fonts must render Vietnamese diacritics; inspect canvas text and narrow mobile layouts.

## Acceptance gates

Current interfaces, metadata, accessibility labels, scene signs, app-controlled error pages and notifications must be Vietnamese with no untranslated English placeholder prose. Number/date/money formatting must have tests. Preserve existing navigation, collision and lifecycle tests. Future phases additionally require reviewed natural NPC dialogue, comprehensible incident choices/outcomes, working integer-VND economy, and localized authentication/save failures. Do not claim those future gates passed before their systems exist. Third-party browser/provider pages and development tooling are outside application copy control.