import { useRef, useState, useSyncExternalStore } from 'react'
import { useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import { Robot3D } from './components/Robot3D'
import { PARTS, Robot, stepFor } from './Robot'

// framer-motion's useReducedMotion reads the setting once; this one follows live OS changes.
const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribeReduce = (onChange: () => void) => {
  reduceQuery.addEventListener('change', onChange)
  return () => reduceQuery.removeEventListener('change', onChange)
}
const useReducedMotion = () => useSyncExternalStore(subscribeReduce, () => reduceQuery.matches)

function supportsRobot3D() {
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return false
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

let webgl2: boolean | undefined
const canRender3D = () => (webgl2 ??= supportsRobot3D())

function caption(step: number) {
  if (step === 0) return 'Exploded view. Scroll to build it.'
  if (step > PARTS.length) return 'Assembled.'
  return `Step ${step} of ${PARTS.length}: ${PARTS[step - 1].caption}`
}

function PartsList({ step }: { step: number }) {
  return (
    <table className="bom">
      <caption>Parts list</caption>
      <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Qty</th>
          <th scope="col">Part no.</th>
          <th scope="col">Name</th>
          <th scope="col"><span className="sr-only">Placed</span></th>
        </tr>
      </thead>
      <tbody>
        {PARTS.map((part, i) => {
          const k = i + 1
          const state = step < k ? 'pending' : step === k ? 'active' : 'placed'
          return (
            <tr key={part.id} data-state={state}>
              <td className="mono">{k}</td>
              <td className="mono">{part.qty}</td>
              <td className="mono">{part.partNo}</td>
              <td>{part.name}</td>
              <td className="check"><span className="sr-only">{state === 'placed' ? 'placed' : 'not placed'}</span></td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function PartsStrip({ step }: { step: number }) {
  const part = PARTS[Math.min(Math.max(step, 1), PARTS.length) - 1]
  return (
    <div className="strip" aria-hidden="true">
      <span className="mono">{part.qty} × {part.partNo}</span>
      <span>{step > PARTS.length ? 'All parts placed' : part.name}</span>
      <span className="ticks">
        {PARTS.map((p, i) => <i key={p.id} data-on={step > i + 1 || undefined} />)}
      </span>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const still = useMotionValue(1)
  const p = reduce ? still : scrollYProgress
  const [scrollStep, setStep] = useState(() => stepFor(p.get()))
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(stepFor(v)))
  const step = reduce ? stepFor(1) : scrollStep

  const [threeFailed, setThreeFailed] = useState(false)
  const threeOn = !reduce && !threeFailed && canRender3D()

  return (
    <section ref={ref} className={reduce ? 'hero hero--static' : 'hero'} aria-labelledby="hero-title">
      <div className="stage">
        <div className="hero-copy">
          <h1 id="hero-title">We build robots.</h1>
          <p className="lede">Bearden High Robotics Club designs, builds, programs and drives VEX robots in Knoxville, Tennessee.</p>
          <a className="button" href="#join">Join the club</a>
          <p className="caption" aria-live="polite" aria-atomic="true">{caption(step)}</p>
        </div>
        <div className="sheet">
          <div className="sheet-model">
            {/* Robot3D keeps this poster until its first frame is drawn, then hands off. */}
            {threeOn ? (
              <Robot3D p={p} step={step} onFail={() => setThreeFailed(true)} />
            ) : (
              <Robot key={reduce ? 'still' : 'scroll'} p={p} step={step} />
            )}
          </div>
          <PartsList step={step} />
          <PartsStrip step={step} />
        </div>
      </div>
    </section>
  )
}
