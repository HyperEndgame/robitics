import {
  BufferGeometry,
  BoxGeometry,
  CylinderGeometry,
  EdgesGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from 'three'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { LAYOUT, type PartLayout } from './parts3d'

// Machine dimensions in inches, taken from the measured SVG drawing
// (24 units = 1 inch) and rounded to VEX part sizes.
const RAIL_LEN = 16.5
const HALF_WIDTH = 5
const WHEEL_R = 2
const WHEEL_W = 1.5
const AXLE_X = 6.25

export type Rigid = {
  partId: string
  group: Group
  home: Vector3
  explode: Vector3
  baseRot: number
  explodeRot: number
  /** 1 for wheels (they spin at the end of the assembly). */
  spin: number
  /** Visible-edge lines (1.5px) plus any part-local edge lines such as the jaws. */
  lines: LineSegments2[]
  /** 0.75px detail lines (holes, screens, spokes). */
  holes: LineSegments2 | null
}

export type RobotModel = {
  root: Group
  rigids: Rigid[]
  jaws: { group: Group; dir: number }[]
  ground: LineSegments2
}

type Materials = {
  fill: MeshBasicMaterial
  edge: LineMaterial
  thin: LineMaterial
  ground: LineMaterial
}

const box = (w: number, h: number, d: number, x = 0, y = 0, z = 0) =>
  new BoxGeometry(w, h, d).translate(x, y, z)

const cylZ = (r: number, h: number, x = 0, y = 0, z = 0, seg = 40) => {
  const g = new CylinderGeometry(r, r, h, seg)
  g.rotateX(Math.PI / 2)
  return g.translate(x, y, z)
}

const RAD = Math.PI / 180

/** Four segments of a small square hole, in the XY plane at a fixed Z. */
function holeXY(out: number[], x: number, y: number, z: number, size = 0.18) {
  const h = size / 2
  const pts: [number, number][] = [
    [x - h, y - h],
    [x + h, y - h],
    [x + h, y - h],
    [x + h, y + h],
    [x + h, y + h],
    [x - h, y + h],
    [x - h, y + h],
    [x - h, y - h],
  ]
  for (const [px, py] of pts) out.push(px, py, z)
}

/** Outline of a rectangle on the XY plane. */
function rectXY(out: number[], x: number, y: number, w: number, h: number, z: number) {
  const x0 = x - w / 2
  const x1 = x + w / 2
  const y0 = y - h / 2
  const y1 = y + h / 2
  out.push(x0, y0, z, x1, y0, z, x1, y0, z, x1, y1, z, x1, y1, z, x0, y1, z, x0, y1, z, x0, y0, z)
}

function makeLines(positions: number[], material: LineMaterial) {
  const g = new LineSegmentsGeometry()
  g.setPositions(positions)
  const lines = new LineSegments2(g, material)
  lines.computeLineDistances()
  return lines
}

function makeEdges(geometry: BufferGeometry, material: LineMaterial) {
  const edges = new EdgesGeometry(geometry, 22)
  const lines = makeLines(Array.from(edges.attributes.position.array as Float32Array), material)
  edges.dispose()
  return lines
}

function makeRigid(
  partId: string,
  home: [number, number, number],
  geos: BufferGeometry[],
  holes: number[],
  mats: Materials,
  layout: PartLayout,
): Rigid {
  const merged = mergeGeometries(geos, false)
  if (!merged) throw new Error(`Could not merge geometry for ${partId}`)
  for (const g of geos) g.dispose()

  const group = new Group()
  group.position.set(...home)
  group.add(new Mesh(merged, mats.fill))

  const lines: LineSegments2[] = [makeEdges(merged, mats.edge)]
  const holesObj = holes.length ? makeLines(holes, mats.thin) : null
  if (holesObj) lines.push(holesObj)
  group.add(...lines)

  return {
    partId,
    group,
    home: new Vector3(...home),
    explode: new Vector3(...layout.explode),
    baseRot: (layout.baseRot ?? 0) * RAD,
    explodeRot: layout.explodeRot * RAD,
    spin: partId === 'wheels' ? 1 : 0,
    lines,
    holes: holesObj,
  }
}

export function createRobot(mats: Materials): RobotModel {
  const root = new Group()
  const rigids: Rigid[] = []
  const jaws: RobotModel['jaws'] = []

  // Chassis: two 33-hole C-channels, four dead axles, and a narrow electronics
  // deck so the drive motors stay visible through the frame.
  {
    const geos: BufferGeometry[] = [
      box(RAIL_LEN, 1, 1, 0, 0, HALF_WIDTH),
      box(RAIL_LEN, 1, 1, 0, 0, -HALF_WIDTH),
      box(15, 0.12, 4.8, 0, 0.5, 0),
    ]
    for (const x of [-AXLE_X, AXLE_X]) {
      for (const z of [5.1, -5.1]) geos.push(cylZ(0.2, 2, x, 0, z, 16))
    }
    const holes: number[] = []
    for (let i = 0; i < 33; i++) {
      const x = -8 + i * 0.5
      holeXY(holes, x, 0, HALF_WIDTH + 0.5)
      holeXY(holes, x, 0, -HALF_WIDTH - 0.5)
    }
    rigids.push(makeRigid('chassis', [0, 2, 0], geos, holes, mats, LAYOUT.chassis))
  }

  // Wheels: two per side, on the two axles.
  for (const x of [-AXLE_X, AXLE_X]) {
    for (const z of [AXLE_X, -AXLE_X]) {
      const geos = [cylZ(WHEEL_R, WHEEL_W), cylZ(0.55, WHEEL_W + 0.25)]
      const holes: number[] = []
      for (const face of [0.76, -0.76]) {
        for (let i = 0; i < 3; i++) {
          const a = (i * 60) * RAD
          const r = 1.55
          holes.push(-Math.cos(a) * r, -Math.sin(a) * r, face, Math.cos(a) * r, Math.sin(a) * r, face)
        }
      }
      rigids.push(makeRigid('wheels', [x, WHEEL_R, z], geos, holes, mats, LAYOUT.wheels))
    }
  }

  // Drive motors, inboard of the rear axle.
  {
    const geos = [
      box(2.4, 2.2, 1.3, -AXLE_X, 0, 3.4),
      box(2.4, 2.2, 1.3, -AXLE_X, 0, -3.4),
      cylZ(0.8, 0.25, -AXLE_X, 0, 4.12, 24),
      cylZ(0.8, 0.25, -AXLE_X, 0, -4.12, 24),
    ]
    rigids.push(makeRigid('motors', [0, 2, 0], geos, [], mats, LAYOUT.motors))
  }

  // Brain, carried between the tower uprights.
  {
    const geos = [box(4.6, 3.4, 1.25)]
    const holes: number[] = []
    rectXY(holes, 0, 0.35, 2.6, 1.6, 0.63)
    for (let i = 0; i < 3; i++) {
      holes.push(-1, -0.25 - i * 0.32, 0.63, 1, -0.25 - i * 0.32, 0.63)
    }
    rigids.push(makeRigid('brain', [1.25, 8.2, 0], geos, holes, mats, LAYOUT.brain))
  }

  // Battery, flat on the deck.
  {
    const geos = [box(4.5, 1.2, 3.5), box(0.6, 0.35, 1.4, 1.95, 0.75, 0)]
    const holes: number[] = [2.2, 0, 1.76, -2.2, 0, 1.76]
    rigids.push(makeRigid('battery', [-4.6, 3.16, 0], geos, holes, mats, LAYOUT.battery))
  }

  // Tower uprights, top plate, brain tray.
  {
    const geos = [
      box(1, 11, 1, 0, 0, HALF_WIDTH),
      box(1, 11, 1, 0, 0, -HALF_WIDTH),
      box(4, 1.5, 10, 0, 4.9, 0),
      box(1.2, 0.7, 10, 0, -1.65, 0),
    ]
    const holes: number[] = []
    for (let i = 0; i < 21; i++) {
      const y = -4.5 + i * 0.5
      holeXY(holes, 0, y, HALF_WIDTH + 0.5)
      holeXY(holes, 0, y, -HALF_WIDTH - 0.5)
    }
    rigids.push(makeRigid('towers', [1.25, 8, 0], geos, holes, mats, LAYOUT.towers))
  }

  // Arm and claw. Pivot at the tower top; the arm rests 20 degrees forward and down.
  {
    const geos = [
      box(13.5, 1, 1, 6.75, 0, 4),
      box(13.5, 1, 1, 6.75, 0, -4),
      box(1, 1, 9, 10, 0, 0),
      box(1.8, 2.6, 2.8, 14.1, 0, 0),
    ]
    const holes: number[] = []
    for (let i = 0; i < 26; i++) {
      const x = 0.75 + i * 0.5
      holeXY(holes, x, 0, 4.5)
      holeXY(holes, x, 0, -4.5)
    }
    const arm = makeRigid('arm', [1.25, 13, 0], geos, holes, mats, LAYOUT.arm)

    for (const dir of [1, -1]) {
      const pivot = new Group()
      pivot.position.set(14.2, dir * 0.9, 0)
      const jawGeo = box(3.6, 0.45, 1.1, 1.8, 0, 0)
      pivot.add(new Mesh(jawGeo, mats.fill))
      const jawLines = makeEdges(jawGeo, mats.edge)
      pivot.add(jawLines)
      arm.group.add(pivot)
      arm.lines.push(jawLines)
      jaws.push({ group: pivot, dir })
    }

    rigids.push(arm)
  }

  for (const r of rigids) root.add(r.group)

  // Drafted ground: a datum line with hatch ticks, revealed as the wheels land.
  const gpos: number[] = [-10, 0.02, 0, 23, 0.02, 0]
  for (let x = -9.5; x <= 22.5; x += 0.55) {
    gpos.push(x, 0.02, 0, x - 0.45, 0.02, 1.5)
  }
  const ground = makeLines(gpos, mats.ground)
  ground.computeLineDistances()

  return { root, rigids, jaws, ground }
}
