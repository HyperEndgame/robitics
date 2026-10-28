# Pipeline

## Project structure

- `index.html` — document shell, fonts, meta
- `src/` — React app (Vite + React 19 + TypeScript + framer-motion)
- `PRODUCT.md` — product truth (users, purpose, constraints)
- `DESIGN.md` — visual system, written from the built site
- Graph: none (`graphify-out/` not generated)

## Branches and deploy

- Commit only to `rcommits`; `main` is fast-forwarded to it on release.
- Railway project `robitics` (workspace "Reversalex's Projects"), service deploys from `main`.

## Feature plan (v1)

1. Scroll-assembly hero: exploded VEX clawbot assembles as you scroll; reduced-motion shows it assembled.
2. About: what the club does (design, build, program, drive).
3. Join: steps to join, meeting info (placeholders).
4. Sponsors: honest empty state + sponsor CTA.
5. Contact: email/advisor placeholders, mailto.

## Implementation progress

- [x] Vite + React + TS scaffold, framer-motion installed
- [x] PRODUCT.md
- [ ] Hero, sections, tokens
- [ ] Review + test pass
- [ ] Railway service from `main`, deployed and verified

## Placeholders to replace

All club-specific facts live in `src/content.ts`, marked `TBD`.

## Review findings

(none yet)
