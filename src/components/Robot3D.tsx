import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'
import { Robot } from '../Robot'
import type { RobotScene } from '../three/robotScene'

const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches

type Props = {
  p: MotionValue<number>
  step: number
  onFail: () => void
}

/**
 * Mounts the Three.js hero model after first paint. The SVG poster stays in
 * place until the first frame is drawn, then hands off; any failure hands back
 * to Hero, which restores the poster for good.
 */
export function Robot3D({ p, step, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<RobotScene | null>(null)
  const progressRef = useRef(p.get())
  const stepRef = useRef(step)
  const interactiveRef = useRef(!coarsePointer)
  const failRef = useRef(onFail)

  const [ready, setReady] = useState(false)
  const [explore, setExplore] = useState(!coarsePointer)

  useEffect(() => {
    failRef.current = onFail
  }, [onFail])

  useEffect(() => {
    progressRef.current = p.get()
    return p.on('change', (v) => {
      progressRef.current = v
      sceneRef.current?.setProgress(v)
    })
  }, [p])

  useEffect(() => {
    stepRef.current = step
    sceneRef.current?.setStep(step)
  }, [step])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let handle: RobotScene | null = null

    const start = async () => {
      try {
        const { createRobotScene } = await import('../three/robotScene')
        if (cancelled) return
        handle = createRobotScene(canvas, {
          onFail: () => {
            if (!cancelled) failRef.current()
          },
        })
        sceneRef.current = handle
        handle.setProgress(progressRef.current)
        handle.setStep(stepRef.current)
        handle.setInteractive(interactiveRef.current)
        setReady(true)
      } catch {
        if (!cancelled) failRef.current()
      }
    }

    const idleWindow = window as unknown as {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number
      cancelIdleCallback?: (id: number) => void
    }
    const idle = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(start, { timeout: 900 })
      : window.setTimeout(start, 250)
    return () => {
      cancelled = true
      if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      handle?.dispose()
      sceneRef.current = null
    }
  }, [])

  function toggleExplore() {
    const next = !explore
    setExplore(next)
    interactiveRef.current = next
    sceneRef.current?.setInteractive(next)
  }

  return (
    <>
      {/* Poster stays until the first canvas frame is ready. */}
      {!ready && <Robot p={p} step={step} />}
      <div className="viewer" data-ready={ready} data-explore={explore}>
        <canvas ref={canvasRef} className="model-canvas" aria-hidden="true" />
        <div className="viewer-ui">
          <p className="viewer-hint" aria-hidden="true">
            Drag to orbit<br />Right-drag to pan<br />⌘/Ctrl-scroll to zoom
          </p>
          <button type="button" className="viewer-button" onClick={() => sceneRef.current?.reset()}>Reset view</button>
          <button type="button" className="viewer-button viewer-explore" onClick={toggleExplore} aria-pressed={explore}>
            {explore ? 'Done' : 'Explore 3D'}
          </button>
        </div>
      </div>
    </>
  )
}
