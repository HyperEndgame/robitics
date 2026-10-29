# Pipeline

## Project structure

- `index.html` — document shell, fonts, meta
- `src/` — React app (Vite + React 19 + TypeScript + framer-motion)
- `src/three/` — Three.js hero scene (layout, procedural geometry, renderer)
- `src/components/Robot3D.tsx` — canvas wrapper, capability checks, viewer controls
- `docs/3d/3DMODEL.md` — model provenance, contract, and GLB swap path
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
- [x] Hero, sections, tokens
- [x] Review + test pass (design finish review + code review/runtime test)
- [x] Railway service `web` from `main`, live at https://web-production-5ecf5.up.railway.app
- [x] DESIGN.md from the built site
- [x] 3D hero: procedural line-art Three.js Clawbot, scroll assembly, orbit/pan/zoom, SVG fallback
- [ ] Club fills in `src/content.ts` (meeting day/time/room, advisor, email)

## Placeholders to replace

All club-specific facts live in `src/content.ts`, marked `TBD`.

## Review findings

Fixed:
- Placeholder CTAs collapsed to inline text when email empty; now dashed button-scale placeholders.
- Exploded wheels/battery drawn through the ground; ground now fades in as wheels land, battery explodes sideways.
- Balloons 2/3 clipped or covered; repositioned. Mobile hides balloons and dimensions (illegible at that scale).
- Sponsor slots were empty dashed frames; now a parts-list-style table.
- Mobile nav hid Sponsors/Contact; all links kept, wordmark shortened.
- Title block claimed "Scale 1:1"; now "NTS".
- Claw jaw pivots off by 8 units; origins corrected.
- framer-motion `useReducedMotion` never updates after mount; replaced with a matchMedia hook, robot remounts on toggle.
- Skip link skipped the hero; now targets `main`.
- 3D hero keeps the page scrollable: wheel zoom needs Cmd/Ctrl, and touch needs an explicit Explore 3D toggle.
- Wheel quantity corrected to 4 (two per side) so the parts list matches the 3D model; the side elevation shows only the near pair.

Open (accepted):
- Step caption is `aria-live`, so screen readers hear up to 9 announcements per scroll pass.
- Below 960px the full parts table is hidden; the step caption carries the same info.
- Design hook flags the grid background; intentional (blueprint surface the user asked for).
- The 3D state drops balloons and dimensions (they would need billboarded overlays); the parts table and step caption carry the same information.
- Three.js ships as a separate lazy chunk (~147 kB gzip); the SVG poster renders before it arrives.
