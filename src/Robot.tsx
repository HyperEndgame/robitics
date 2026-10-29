import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { ReactNode } from 'react'

// Drawing scale: 24 units = 1 inch, VEX hole pitch 0.5in = 12 units.
const STEP_START = 0.06
const STEP_LEN = 0.11
export const MOVE_LEN = 0.09
export const ASSEMBLED_AT = 0.83

export type Part = {
  id: string
  qty: number
  partNo: string
  name: string
  caption: string
  dx: number
  dy: number
  rot: number
  anchor: [number, number] // assembled point the guide line and balloon start from
  balloon: [number, number]
}

export const PARTS: Part[] = [
  { id: 'chassis', qty: 2, partNo: 'BHR-101', name: 'C-channel rail, 33‑hole', caption: 'Lay out the chassis rails', dx: 0, dy: -24, rot: -2, anchor: [630, 600], balloon: [870, 560] },
  { id: 'wheels', qty: 4, partNo: 'BHR-102', name: 'Wheel, 4 in', caption: 'Fit the wheels', dx: 0, dy: 84, rot: 0, anchor: [780, 600], balloon: [880, 600] },
  { id: 'motors', qty: 2, partNo: 'BHR-103', name: 'Smart motor, drive', caption: 'Mount the drive motors', dx: 0, dy: -170, rot: 0, anchor: [480, 600], balloon: [560, 540] },
  { id: 'brain', qty: 1, partNo: 'BHR-104', name: 'Robot brain', caption: 'Mount the brain', dx: -150, dy: -110, rot: -6, anchor: [510, 483], balloon: [380, 420] },
  { id: 'battery', qty: 1, partNo: 'BHR-105', name: 'Battery', caption: 'Seat the battery', dx: 300, dy: 0, rot: 3, anchor: [636, 626], balloon: [700, 580] },
  { id: 'towers', qty: 2, partNo: 'BHR-106', name: 'Tower upright, 22‑hole', caption: 'Raise the towers', dx: 0, dy: -110, rot: 0, anchor: [660, 456], balloon: [580, 300] },
  { id: 'arm', qty: 1, partNo: 'BHR-107', name: 'Arm and claw assembly', caption: 'Attach the arm and claw', dx: 90, dy: -150, rot: -18, anchor: [800, 390], balloon: [900, 470] },
]

export const stepStart = (k: number) => STEP_START + (k - 1) * STEP_LEN

export function stepFor(p: number) {
  if (p < STEP_START) return 0
  if (p >= ASSEMBLED_AT) return PARTS.length + 1
  return Math.floor((p - STEP_START) / STEP_LEN) + 1
}

function holes(x: number, y: number, n: number, vertical = false) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const hx = vertical ? x : x + i * 12
    const hy = vertical ? y + i * 12 : y
    d += `M${hx} ${hy}h4.4v4.4h-4.4z`
  }
  return d
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

function PartGroup({ part, k, p, step, children }: { part: Part; k: number; p: MotionValue<number>; step: number; children: ReactNode }) {
  const s = stepStart(k)
  const range = [s, s + MOVE_LEN]
  const x = useTransform(p, range, [part.dx, 0], { ease })
  const y = useTransform(p, range, [part.dy, 0], { ease })
  const rotate = useTransform(p, range, [part.rot, 0], { ease })
  const state = step < k ? 'pending' : step === k ? 'active' : 'placed'
  const [ax, ay] = part.anchor
  const [bx, by] = part.balloon
  return (
    <motion.g className="part" data-state={state} style={{ x, y, rotate }}>
      {children}
      <g className="balloon" aria-hidden="true">
        <line x1={ax} y1={ay} x2={bx} y2={by} />
        <circle cx={bx} cy={by} r="11" />
        <text x={bx} y={by + 4}>{k}</text>
      </g>
    </motion.g>
  )
}

function Guide({ part, k, p }: { part: Part; k: number; p: MotionValue<number> }) {
  const s = stepStart(k)
  const opacity = useTransform(p, [s, s + MOVE_LEN], [1, 0])
  const [ax, ay] = part.anchor
  return <motion.line className="guide" x1={ax} y1={ay} x2={ax + part.dx} y2={ay + part.dy} style={{ opacity }} />
}

function Wheel({ cx, spin }: { cx: number; spin: MotionValue<number> }) {
  return (
    <g>
      <circle className="solid" cx={cx} cy="600" r="48" />
      <circle cx={cx} cy="600" r="42" />
      <circle cx={cx} cy="600" r="34" />
      <motion.g style={{ rotate: spin }}>
        {[0, 60, 120].map((a) => (
          <line key={a} x1={cx - 34} y1="600" x2={cx + 34} y2="600" transform={`rotate(${a} ${cx} 600)`} />
        ))}
      </motion.g>
      <circle className="solid" cx={cx} cy="600" r="10" />
      <rect x={cx - 2.2} y="597.8" width="4.4" height="4.4" />
      <path className="center" d={`M${cx - 58} 600h116M${cx} 542v116`} />
    </g>
  )
}

function Motors({ p }: { p: MotionValue<number> }) {
  const s = stepStart(3)
  const solid = useTransform(p, [s + MOVE_LEN - 0.02, s + MOVE_LEN], [1, 0])
  const hidden = useTransform(p, [s + MOVE_LEN - 0.02, s + MOVE_LEN], [0, 1])
  const body = (x: number) => (
    <g key={x}>
      <rect x={x} y="577" width="56" height="46" rx="6" />
      <circle cx={x + 28} cy="600" r="10" />
    </g>
  )
  return (
    <>
      <motion.g style={{ opacity: solid }}>{[452, 752].map(body)}</motion.g>
      <motion.g className="hidden-line" style={{ opacity: hidden }}>{[452, 752].map(body)}</motion.g>
    </>
  )
}

function Claw({ p }: { p: MotionValue<number> }) {
  const top = useTransform(p, [ASSEMBLED_AT, 0.9], [-22, 0], { ease })
  const bottom = useTransform(p, [ASSEMBLED_AT, 0.9], [22, 0], { ease })
  return (
    <g transform="translate(312 0) rotate(-20)">
      <rect className="solid" x="0" y="-24" width="20" height="48" />
      <rect x="-6" y="-46" width="40" height="22" rx="4" />
      <motion.path d="M20 -14 L70 -18 L92 -6" style={{ rotate: top, originX: 0, originY: 1 / 3 }} />
      <motion.path d="M20 14 L70 18 L92 6" style={{ rotate: bottom, originX: 0, originY: 2 / 3 }} />
    </g>
  )
}

export function Robot({ p, step }: { p: MotionValue<number>; step: number }) {
  const drive = useTransform(p, [0.9, 0.97], [0, 24], { ease })
  const spin = useTransform(p, [0.9, 0.97], [0, 29], { ease })
  const dims = useTransform(p, [0.8, 0.86], [0, 1])
  // The ground appears as the wheels land, so exploded parts never sit "underground".
  const ground = useTransform(p, [stepStart(2), stepStart(2) + MOVE_LEN], [0, 1])
  const art: Record<string, ReactNode> = {
    chassis: (
      <g>
        <rect className="solid" x="432" y="588" width="396" height="24" />
        <path d="M432 591h396M432 609h396" />
        <path className="holes" d={holes(438, 597.8, 33)} />
      </g>
    ),
    wheels: (
      <g>
        <Wheel cx={480} spin={spin} />
        <Wheel cx={780} spin={spin} />
      </g>
    ),
    motors: <Motors p={p} />,
    brain: (
      <g>
        <path d="M468 534v54M552 534v54" />
        <rect className="solid" x="444" y="432" width="132" height="102" rx="8" />
        <rect x="456" y="444" width="96" height="60" rx="3" />
        <path className="thin" d="M464 456h48M464 466h72M464 476h36" />
        <path className="holes" d="M462 514h8v8h-8zM482 514h8v8h-8zM502 514h8v8h-8zM522 514h8v8h-8z" />
      </g>
    ),
    battery: (
      <g>
        <rect className="solid" x="576" y="612" width="120" height="28" rx="3" />
        <path d="M600 612v28M672 612v28" />
        <rect x="696" y="620" width="8" height="12" />
      </g>
    ),
    towers: (
      <g>
        <rect className="solid" x="624" y="324" width="24" height="264" />
        <rect className="solid" x="672" y="324" width="24" height="264" />
        <path className="holes" d={holes(633.8, 336, 21, true) + holes(681.8, 336, 21, true)} />
        <rect className="solid" x="612" y="318" width="96" height="36" />
        <path className="holes" d={holes(621.8, 333.8, 8)} />
      </g>
    ),
    arm: (
      <g transform="translate(660 336) rotate(20)">
        <rect className="solid" x="-12" y="-12" width="324" height="24" />
        <path className="holes" d={holes(-6, -2.2, 27)} />
        <rect className="solid" x="-30" y="-26" width="60" height="46" rx="6" />
        <circle cx="0" cy="-3" r="10" />
        <Claw p={p} />
      </g>
    ),
  }

  return (
    <svg className="robot" viewBox="260 180 880 560" role="img" aria-labelledby="robot-title robot-desc">
      <title id="robot-title">Clawbot, side elevation</title>
      <desc id="robot-desc">A VEX-style clawbot built from chassis rails, two wheels, drive motors, a brain, a battery, two tower uprights, and an arm with a claw.</desc>
      <motion.g className="ground" style={{ opacity: ground }} aria-hidden="true">
        <path d="M300 648h820" />
        <path className="thin" d={Array.from({ length: 41 }, (_, i) => `M${304 + i * 20} 648l-10 12`).join('')} />
      </motion.g>
      <g className="guides" aria-hidden="true">
        {PARTS.map((part, i) => <Guide key={part.id} part={part} k={i + 1} p={p} />)}
      </g>
      <motion.g style={{ x: drive }}>
        {PARTS.map((part, i) => (
          <PartGroup key={part.id} part={part} k={i + 1} p={p} step={step}>
            {art[part.id]}
          </PartGroup>
        ))}
        <motion.g className="dims" style={{ opacity: dims }} aria-hidden="true">
          <path d="M432 660v40M828 660v40M392 648h-28M392 318h-28" />
          <path className="dim-line" d="M432 688h396M380 648V318" />
          <path className="arrow" d="M432 688l10 -4v8zM828 688l-10 -4v8zM380 648l-4 -10h8zM380 318l-4 10h8z" />
          <rect className="dim-bg" x="606" y="680" width="48" height="16" />
          <text x="630" y="692">16.50</text>
          <rect className="dim-bg" x="356" y="474" width="48" height="16" />
          <text x="380" y="486">13.75</text>
        </motion.g>
      </motion.g>
    </svg>
  )
}
