---
name: Bearden High Robotics Club
description: The club's build manual, drawn as a light engineering assembly sheet.
colors:
  blueprint-paper: "#eef1f4"
  grid-minor: "#dde2e8"
  grid-major: "#c9d0d8"
  drafting-ink: "#1f2328"
  graphite: "#545b64"
  construction-gray: "#7c838c"
  bearden-maroon: "#7a1f2e"
  maroon-deep: "#5e1622"
  maroon-wash: "#f1e3e5"
  on-maroon: "#ffffff"
  on-maroon-soft: "#ebd3d7"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.2vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.75rem)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  spec-term:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2rem)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 120"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1
    fontVariation: "'wdth' 110"
  lede:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  sharp: "2px"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  section-y: "clamp(80px, 11vw, 144px)"
  block-gap: "clamp(48px, 7vw, 80px)"
  row: "28px"
  cell: "4px 10px"
  nav-height: "48px"
components:
  button-primary:
    backgroundColor: "{colors.bearden-maroon}"
    textColor: "{colors.on-maroon}"
    rounded: "{rounded.sharp}"
    padding: "12px 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.maroon-deep}"
    textColor: "{colors.on-maroon}"
  button-light:
    backgroundColor: "{colors.on-maroon}"
    textColor: "{colors.bearden-maroon}"
    rounded: "{rounded.sharp}"
    padding: "12px 24px"
    height: "48px"
  button-light-hover:
    backgroundColor: "{colors.on-maroon-soft}"
    textColor: "{colors.bearden-maroon}"
  button-placeholder:
    textColor: "{colors.bearden-maroon}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "12px 24px"
    height: "48px"
  nav-link:
    textColor: "{colors.graphite}"
    typography: "{typography.body}"
    height: "{spacing.nav-height}"
    padding: "0 12px"
  parts-list-row-active:
    backgroundColor: "{colors.maroon-wash}"
    textColor: "{colors.bearden-maroon}"
    padding: "{spacing.cell}"
---

# Design System: Bearden High Robotics Club

## Overview

**Creative North Star: "The Assembly Sheet"**

The whole site is a build manual a student could actually follow: cool-gray blueprint paper ruled with a fine grid, ink-gray technical line art, and Bearden maroon used as drafting-pen ink for whatever matters right now (the part being placed, the call to action, the Join field). Every device comes from engineering drawings: balloons with leader lines, dashed assembly guides, center lines, dimension lines with arrowheads, a parts list, and a title block that closes the page. Nothing is rendered, lit, or glowing. The robot is a line drawing, and the content sits on the sheet like annotations.

The page is light, calm, and deliberately sparse. Type is wide, heavy Archivo for anything spoken aloud and JetBrains Mono only for things you would read off a drawing (part numbers, quantities, step captions, placeholders). Depth comes from line weight and ink value, never from shadows. The only full color field on the page is the maroon Join section, which makes the single action unmissable.

The rejected default is the robotics category look: dark hero, glowing robot render, icon-card grids. Honesty is part of the look too: anything the club has not decided yet is drawn as a dashed, monospaced "TBD" mark, the way an unfinished drawing marks a value still to be confirmed.

**Key Characteristics:**
- Light blueprint paper with a two-level grid (24px minor, 120px major) behind every section.
- Line art at a single weight (1.5px, non-scaling) with 0.75px for thin, center, and leader lines.
- Maroon is a state and an action color, never decoration.
- Square, ruled forms: 1px and 1.5px rules, 2px corner at most on interface chrome.
- Wide Archivo headings; monospace only for drawing data.
- Motion is assembly: parts travel along their guides as you scroll; everything else is a short color fade.

## Colors

A cool, near-monochrome drafting palette with one saturated school color used sparingly as ink.

### Primary
- **Bearden Maroon** (bearden-maroon): the school color. The active part in the drawing and its parts-list row, primary buttons, the Join link in the nav, focus rings, list bullets, the "TBD" placeholder mark, icon strokes in the About spec, and the full-bleed Join section background.
- **Maroon Deep** (maroon-deep): hover state of the primary button only.
- **Maroon Wash** (maroon-wash): background of the active parts-list row, so the highlighted row reads without losing text contrast.
- **On Maroon** (on-maroon) and **On Maroon Soft** (on-maroon-soft): text and rules inside the maroon field. Soft carries secondary copy, step numerals, step rules, and the light button's hover.

### Neutral
- **Blueprint Paper** (blueprint-paper): the page, and the fill of every drawn part, table, and title block so they sit opaquely on the grid.
- **Grid Minor / Grid Major** (grid-minor, grid-major): the 24px and 120px grid rules. Grid Major also rules the nav bottom edge and the internal rows of the parts list.
- **Drafting Ink** (drafting-ink): body text, headings, the default stroke of the drawing, and the heavy 1.5px frame rules of tables, specs, and the title block.
- **Graphite** (graphite): secondary text (ledes, nav links, table headers, labels), placed parts, the ground line, and dimension lines.
- **Construction Gray** (construction-gray): lines only. Center lines, assembly guides, caption rule, and light row separators.

### Named Rules
**The Pen-Ink Rule.** Maroon marks what is active or actionable: the part being placed, the thing to click, the Join field. If an element is neither, it is drawn in ink or graphite.

**The Lines-Only Gray Rule.** Construction Gray (about 3.4:1 on paper) is for strokes and rules, never for text. Secondary text uses Graphite, which clears 4.5:1.

## Typography

**Display Font:** Archivo variable (with system-ui, sans-serif), width axis 62–125 loaded
**Body Font:** Archivo (same family, default width)
**Label/Mono Font:** JetBrains Mono 400/500 (with ui-monospace, monospace)

**Character:** Archivo pushed wide and heavy reads like stenciled lettering on a drawing; at body width it stays plain and legible. JetBrains Mono with tabular numerals plays the role of drafting annotation.

### Hierarchy
- **Display** (800, width 125, clamp 2.6–5.5rem, line-height 0.95): the hero statement only.
- **Headline** (750, width 112, clamp 2–3.75rem, line-height 1): section titles, written as short sentences ending in a period.
- **Spec Term** (750, width 120, clamp 1.5–2rem): the verbs in the About spec list.
- **Title** (700, width 110, 1.125rem): subsection heads. Width 110 at 700 is also the button and table-caption voice.
- **Lede** (400, clamp 1.05–1.25rem): intro paragraphs in Graphite, 34ch in the hero, 52ch in sections.
- **Body** (400, 16px, line-height 1.55): running text, capped near 48ch in spec rows.
- **Label** (mono 400, 0.875–0.9rem, tabular numerals): part numbers, quantities, step captions, title-block values, placeholders. Drawing callouts use the same face at 13px inside the SVG.

### Named Rules
**The Drawing-Data Rule.** Monospace is reserved for values you would read off a drawing: numbers, part codes, captions, TBD marks. Headings, buttons, and prose are never set in mono (the placeholder button is the one exception, because its label is itself a TBD mark).

**The Wide-For-Weight Rule.** Weight and width rise together. Headings use width 110–125; body text stays at default width.

## Layout

Content sits in a 1200px column centered on the sheet, with a fluid gutter (16–48px) and generous section padding (80–144px vertical). Inside sections, major blocks are separated by 48–80px. The grid background runs edge to edge beneath everything; sections do not get their own panels, except the Join section, which drenches the full width in maroon.

The hero is a pinned stage under a 48px sticky nav: a copy column of at least 300px (about a third) beside the drawing, with the parts list anchored bottom right. Spec and contact lists are two-column ruled grids (term and description). Join steps run in three columns.

Responsive: at 960px the stage stacks to one column, the parts-list table is replaced by a compact one-line parts strip with tick boxes, and Join steps stack. At 720px spec and contact lists go single-column, the title block folds to two columns, and drawing balloons and dimensions are dropped because their labels would fall below legible size. At 560px the wordmark shortens to "Bearden" and nav links tighten.

## Elevation & Depth

The system is flat. There are no shadows anywhere. Depth is drafted, not lit: heavier 1.5px rules frame things that are objects on the sheet (tables, the title block, the spec list top), 1px rules divide inside them, and ink value separates states (ink for pending, maroon for active, graphite for placed). Drawn parts and tables are filled with paper color so they cover the grid, which is the only layering device. Hidden lines are dashed, the way a drawing shows what is behind.

### Named Rules
**The Drafted-Depth Rule.** Hierarchy comes from line weight, dash pattern, and ink value. A shadow, glow, or blur on this sheet is a foreign object.

## Shapes

Interface chrome is square: buttons take a 2px corner, everything else (tables, title block, nav, strip, tick boxes, list bullets) is 0. Bullets are 7px solid maroon squares. Lines carry meaning through pattern: solid for edges, long-dash-dot for center lines, short even dashes for assembly guides and hidden lines, and a dashed underline or dashed border for placeholders. Inside the drawing, parts take whatever radius the real VEX part has (the brain and battery have softened corners); that radius belongs to the object, not to the UI.

## Components

### Buttons
Solid, square, and confident; they look like a stamped label.
- **Shape:** near-square (2px radius), 2px border matching the fill, 48px minimum height.
- **Primary:** maroon fill, white text, Archivo 700 at width 110, 12px 24px padding.
- **Hover / Focus:** fill and border shift to Maroon Deep over 0.2s on the out-expo curve; pressing nudges down 1px. Focus is the global 2px maroon outline at 3px offset.
- **Light (on maroon):** white fill, maroon text; hover goes to On Maroon Soft. Used only inside the Join field.
- **Placeholder:** same footprint, dashed border, transparent fill, mono 500 at 0.9rem, inert. Shown while the club email is not set.

### Navigation
A 48px sticky bar on paper with a Grid Major bottom rule. The wordmark is Archivo 800 at width 125. Links are Graphite and turn Ink on hover; the Join link is always maroon and bold. Links are full-height hit targets with 12px side padding.

### Parts List (signature)
A ruled bill-of-materials table: 1.5px ink frame, a bold captioned header cell, 1px Grid Major row rules, 13px text, mono for item, quantity, and part number. Rows carry state: pending in ink, active on Maroon Wash with maroon text, placed in graphite with a drawn check mark. The same table, wider and without state, lists open sponsor slots. On narrow screens the hero version collapses to a one-line strip with square tick boxes that fill maroon.

### Exploded Robot Drawing (signature)
An SVG line drawing at 1.5px non-scaling strokes on paper-filled shapes. Each part sits offset along a dashed guide with a numbered balloon and leader line; scroll progress moves it home on a cubic in-out curve while the part turns maroon, then graphite once placed, and its balloon fades. Dimensions and a hatched ground line appear once assembled. With reduced motion the drawing is shown assembled and static.

### Spec List
A definition list with a 1.5px ink top rule and Construction Gray row rules, 28px row padding. Terms pair a 32px maroon line icon (drawn in the same stroke language as the robot) with a wide heavy verb.

### Title Block
The page footer, styled as a drawing title block: 1.5px ink frame, 1px ink cell dividers, small Graphite labels over mono values (Title, Drawn by, Location, Scale, Rev, Sheet).

### Placeholder Mark
Any undecided fact renders as maroon mono text with a 1.5px dashed underline reading "[Thing] TBD". Inside the maroon field it switches to on-maroon colors.

## Do's and Don'ts

### Do:
- **Do** keep the two-level blueprint grid (24px minor, 120px major, 1px rules) behind the page; it is part of the world.
- **Do** fill drawn parts, tables, and the title block with Blueprint Paper so they sit on top of the grid.
- **Do** draw new illustrations and icons in the robot's stroke language: 1.5px round-joined strokes, 0.75px for thin and center lines, maroon only for the active element.
- **Do** mark every undecided fact with the dashed mono TBD mark instead of inventing a value.
- **Do** use the out-expo curve (cubic-bezier(0.16, 1, 0.3, 1)) at 0.2–0.3s for color and opacity state changes, and drop all transitions under reduced motion.
- **Do** keep text at Graphite or darker on paper, and On Maroon Soft or lighter on maroon.

### Don't:
- **Don't** use shadows, glows, blur, or soft tonal gradients; the grid's 1px rules are the only gradient-built thing on the page.
- **Don't** set text in Construction Gray.
- **Don't** use maroon for decoration or for more than one full-bleed field per page.
- **Don't** round interface chrome beyond 2px or wrap content in cards; group with rules and ruled tables as a drawing would.
- **Don't** use dashed lines casually; dashes mean an assembly guide, a hidden line, or a placeholder.
- **Don't** set prose, headings, or buttons in monospace (the placeholder button excepted).
