# Hero 3D Model

Status: implemented behind capability checks. Falls back to the SVG poster in
`src/Robot.tsx`.

## What this is

The hero model is an **illustrative VEX V5 Clawbot**, built procedurally in
Three.js from the measurements already encoded in the hero drawing. It is not a
scan of the club's robot and must not be described as one (see `PRODUCT.md`,
"Evidence on Hand").

- Drawing scale: 24 SVG units = 1 inch (VEX hole pitch 0.5 in = 12 units).
- World scale: 1 unit = 1 inch, Y up, ground at Y=0.
- Derived sizes: 4 in wheels (2 in radius), 12.5 in wheelbase, 16.5 in chassis
  rails, 13.75 in overall height, 1 in C-channel.

Source of truth for the assembly: `src/three/parts3d.ts` (home pivots, explode
offsets, camera). Geometry: `src/three/buildRobot.ts`.

## Seven-part contract

Part ids are the `PARTS` ids in `src/Robot.tsx` and drive both the parts list
and the scene state machine:

`chassis, wheels, motors, brain, battery, towers, arm`

Each step turns the active part maroon, already-placed parts graphite, pending
parts ink. Scroll progress uses `stepStart` / `MOVE_LEN` from `src/Robot.tsx`,
so the 3D and SVG timelines stay in sync.

## Rendering

- Orthographic camera, front-right three-quarter view, no perspective.
- Unlit `MeshBasicMaterial` fills in Blueprint Paper; no lights, textures,
  shadows, or gradients (DESIGN.md, Drafted-Depth Rule).
- Visible edges via `EdgesGeometry` + `LineSegments2` / `LineMaterial` at 1.5 px,
  detail lines (holes, screens, spokes) at 0.75 px.
- The ground datum and hatch marks fade in as the wheels land.
- Claw jaws close at `ASSEMBLED_AT`; wheels spin and the model rolls forward at
  the end of the scroll, matching the SVG.

## Interaction

- Drag to orbit, right-drag (or two-finger) to pan.
- Zoom: `Cmd`/`Ctrl` + scroll on desktop, pinch on touch. A plain wheel always
  scrolls the page; the canvas never traps the page by default.
- Touch devices get an explicit **Explore 3D** toggle before the canvas captures
  gestures, so a one-finger drag still scrolls the page.
- **Reset view** restores the framing. Both controls are real DOM buttons.
- Reduced motion, no WebGL2, Save-Data, or a lost context keeps the static SVG.

## Accessibility

- Canvas is `aria-hidden`; the parts table and live step caption remain the
  accessible description of the assembly.
- No information or action exists only in the canvas.

## Performance

- Three.js is dynamically imported after first paint; it adds a separate
  ~147 kB gzip chunk.
- DPR capped at 2; rendering pauses when the canvas is offscreen or the tab is
  hidden; geometries, materials, controls, and the renderer are disposed on
  unmount.
- ~10 rigid bodies, roughly 35 draw calls.

## Swapping in real CAD later

1. Export a Y-up GLB with one node per id above (or one group of rigid bodies
   per id, as the procedural model does), origins at the assembly pivots.
2. Keep `parts3d.ts` (pivots/explode/camera) and replace `buildRobot.ts` with a
   `GLTFLoader` + `MeshoptDecoder` path.
3. Re-apply the line-art look with `EdgesGeometry` per node; keep the same
   three state materials.
4. Record author, source, license/permission, and conversion date here.

Until then, `src/Robot.tsx` stays the poster, the fallback, and the measured
reference for the model.
