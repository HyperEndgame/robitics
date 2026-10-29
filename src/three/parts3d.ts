// Layout contract for the 3D hero.
//
// The SVG in src/Robot.tsx is measured at 24 units = 1 inch, ground at y=648,
// drawing origin x=630. This file uses the same machine in inches, Y up, camera
// on +Z. Every id here matches an id in PARTS (src/Robot.tsx); a future GLB swap
// keeps this table and only replaces the geometry builder.

export const COLORS = {
  paper: '#eef1f4',
  ink: '#1f2328',
  graphite: '#545b64',
  maroon: '#7a1f2e',
} as const

export type PartState = 'pending' | 'active' | 'placed'

export type PartLayout = {
  /** Exploded offset in inches, added to the part's home position. */
  explode: [number, number, number]
  /** Extra Z rotation while exploded, in degrees. */
  explodeRot: number
  /** Resting Z rotation, in degrees. */
  baseRot?: number
}

export const LAYOUT: Record<string, PartLayout> = {
  chassis: { explode: [0, 0, 0], explodeRot: 0 },
  wheels: { explode: [0, 3.2, 0], explodeRot: 0 },
  motors: { explode: [0, 5.5, 0], explodeRot: 0 },
  brain: { explode: [-6, 2.5, 0], explodeRot: -5 },
  battery: { explode: [6.5, 1.2, 2.2], explodeRot: 3 },
  towers: { explode: [0, 5.5, 0], explodeRot: 0 },
  arm: { explode: [3, 3, 0], explodeRot: 18, baseRot: -20 },
}

/**
 * Fixed framing box (inches) covering both the exploded and assembled states,
 * so the camera never breathes while the hero assembles.
 */
export const STAGE = {
  min: [-10, -1, -9] as [number, number, number],
  max: [23.5, 20, 9] as [number, number, number],
}

export const CAMERA = {
  /** Unit direction from target to camera: front-right, slightly above. */
  direction: [0.5, 0.34, 0.8] as [number, number, number],
  distance: 60,
  fit: 1.12,
  minZoom: 0.7,
  maxZoom: 4,
}
