import { Mesh, MeshBasicMaterial, OrthographicCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { ASSEMBLED_AT, MOVE_LEN, PARTS, stepStart } from '../Robot'
import { createRobot } from './buildRobot'
import { CAMERA, COLORS, STAGE, type PartState } from './parts3d'

const STEP_OF = new Map(PARTS.map((part, i) => [part.id, i + 1]))

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export type RobotScene = {
  setProgress(p: number): void
  setStep(step: number): void
  setInteractive(on: boolean): void
  reset(): void
  resize(): void
  dispose(): void
}

export function createRobotScene(canvas: HTMLCanvasElement, opts: { onFail: () => void }): RobotScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 200)

  const fill = new MeshBasicMaterial({
    color: COLORS.paper,
    polygonOffset: true,
    polygonOffsetFactor: 2,
    polygonOffsetUnits: 2,
  })

  const line = (color: string, width: number) =>
    new LineMaterial({ color, linewidth: width, worldUnits: false })

  const edges: Record<PartState, LineMaterial> = {
    pending: line(COLORS.ink, 1.5),
    active: line(COLORS.maroon, 1.5),
    placed: line(COLORS.graphite, 1.5),
  }
  const thin: Record<PartState, LineMaterial> = {
    pending: line(COLORS.ink, 0.75),
    active: line(COLORS.maroon, 0.75),
    placed: line(COLORS.graphite, 0.75),
  }
  const groundMat = line(COLORS.graphite, 1)
  groundMat.transparent = true
  groundMat.opacity = 0

  const model = createRobot({ fill, edge: edges.pending, thin: thin.pending, ground: groundMat })
  scene.add(model.root, model.ground)

  const target = new Vector3(
    (STAGE.min[0] + STAGE.max[0]) / 2,
    (STAGE.min[1] + STAGE.max[1]) / 2,
    (STAGE.min[2] + STAGE.max[2]) / 2,
  )
  const direction = new Vector3(...CAMERA.direction).normalize()
  const homePosition = target.clone().addScaledVector(direction, CAMERA.distance)
  camera.position.copy(homePosition)
  camera.lookAt(target)

  const controls = new OrbitControls(camera, canvas)
  controls.target.copy(target)
  controls.enableDamping = true
  controls.dampingFactor = 0.09
  controls.rotateSpeed = 0.65
  controls.zoomSpeed = 0.8
  controls.panSpeed = 0.7
  controls.screenSpacePanning = true
  controls.minZoom = CAMERA.minZoom
  controls.maxZoom = CAMERA.maxZoom
  controls.minPolarAngle = 0.25
  // Keep the camera above the ground plane; the drawing has no underside.
  controls.maxPolarAngle = Math.PI / 2 - 0.03
  controls.enableZoom = matchMedia('(hover: none) and (pointer: coarse)').matches
  controls.update()

  // Plain wheel gestures must keep scrolling the page. Zoom takes an explicit modifier.
  const wheelGate = (e: WheelEvent) => {
    controls.enableZoom = e.ctrlKey || e.metaKey
  }
  canvas.addEventListener('wheel', wheelGate, { passive: true, capture: true })

  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    const aspect = w / h
    const boxW = STAGE.max[0] - STAGE.min[0]
    const boxH = STAGE.max[1] - STAGE.min[1]
    const viewH = Math.max(boxH, boxW / aspect) * CAMERA.fit
    camera.left = (-viewH * aspect) / 2
    camera.right = (viewH * aspect) / 2
    camera.top = viewH / 2
    camera.bottom = -viewH / 2
    camera.updateProjectionMatrix()
    for (const m of [...Object.values(edges), ...Object.values(thin), groundMat]) {
      m.resolution.set(w, h)
    }
  }

  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()

  let progress = 0
  let step = -1
  let visible = true
  let failed = false

  function apply() {
    const spin = -2.4 * ease(clamp01((progress - 0.9) / 0.07))
    for (const rigid of model.rigids) {
      const k = STEP_OF.get(rigid.partId) ?? 1
      const t = ease(clamp01((progress - stepStart(k)) / MOVE_LEN))
      rigid.group.position.copy(rigid.home).addScaledVector(rigid.explode, 1 - t)
      rigid.group.rotation.z = rigid.baseRot + rigid.explodeRot * (1 - t) + (rigid.spin ? spin : 0)
    }

    const jawOpen = 0.34 * (1 - ease(clamp01((progress - ASSEMBLED_AT) / 0.07)))
    for (const jaw of model.jaws) jaw.group.rotation.z = jaw.dir * jawOpen

    model.root.position.x = 0.9 * ease(clamp01((progress - 0.9) / 0.07))
    groundMat.opacity = ease(clamp01((progress - stepStart(2)) / MOVE_LEN))
  }

  function setStep(next: number) {
    if (next === step || failed) return
    step = next
    for (const rigid of model.rigids) {
      const k = STEP_OF.get(rigid.partId) ?? 1
      const state: PartState = next < k ? 'pending' : next === k ? 'active' : 'placed'
      for (const l of rigid.lines) l.material = edges[state]
      if (rigid.holes) rigid.holes.material = thin[state]
    }
  }

  function setProgress(next: number) {
    progress = next
  }

  function setInteractive(on: boolean) {
    controls.enabled = on
    canvas.style.pointerEvents = on ? 'auto' : 'none'
    canvas.style.cursor = on ? 'grab' : 'default'
    // touch-action is also set by OrbitControls on connect; ours wins for the
    // passive state so a one-finger drag still scrolls the page on phones.
    canvas.style.touchAction = on ? 'none' : 'pan-y'
  }

  function reset() {
    controls.target.copy(target)
    camera.position.copy(homePosition)
    camera.zoom = 1
    camera.updateProjectionMatrix()
    controls.update()
  }

  const frame = () => {
    if (!visible) return
    apply()
    controls.update()
    renderer.render(scene, camera)
  }
  renderer.setAnimationLoop(frame)

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
  })
  io.observe(canvas)

  const onVisibility = () => {
    visible = !document.hidden
  }
  document.addEventListener('visibilitychange', onVisibility)

  const onLost = (e: Event) => {
    e.preventDefault()
    if (failed) return
    failed = true
    opts.onFail()
  }
  canvas.addEventListener('webglcontextlost', onLost)

  apply()

  return {
    setProgress,
    setStep,
    setInteractive,
    reset,
    resize,
    dispose() {
      failed = true
      renderer.setAnimationLoop(null)
      observer.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('wheel', wheelGate, true)
      canvas.removeEventListener('webglcontextlost', onLost)
      controls.dispose()
      scene.traverse((obj) => {
        if (obj instanceof Mesh || obj instanceof LineSegments2) obj.geometry.dispose()
      })
      fill.dispose()
      for (const m of [...Object.values(edges), ...Object.values(thin), groundMat]) m.dispose()
      renderer.dispose()
    },
  }
}
