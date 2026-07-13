import { useRef, useEffect } from "react"
import * as THREE from "three"

export type PlanetType =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"

export type CosmicState = "idle" | "running" | "paused" | "success"

interface PlanetRendererProps {
  planetType: PlanetType
  state: CosmicState
}

// ─────────────────────────────────────────────
// HELPERS & TEXTURE MAPPING
// ─────────────────────────────────────────────

const PLANET_TEXTURES: Record<Exclude<PlanetType, "sun">, string> = {
  mercury: "/textures/mercurymap.jpg",
  venus:   "/textures/venusmap.jpg",
  earth:   "/textures/earthmap1k.jpg",
  mars:    "/textures/marsmap1k.jpg",
  jupiter: "/textures/jupitermap.jpg",
  saturn:  "/textures/saturnmap.jpg",
  uranus:  "/textures/uranusmap.jpg",
  neptune: "/textures/neptunemap.jpg",
}

function generateSunTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas")
  c.width = 512
  c.height = 256
  const ctx = c.getContext("2d")!
  
  // Base background: fiery red/orange gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, "#e63b00")
  grad.addColorStop(0.5, "#ff8800")
  grad.addColorStop(1, "#e63b00")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 256)
  
  // Draw plasma cells
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 256
    const r = 10 + Math.random() * 30
    const cellGrad = ctx.createRadialGradient(x, y, 0, x, y, r)
    cellGrad.addColorStop(0, "rgba(255, 230, 0, 0.45)")
    cellGrad.addColorStop(0.5, "rgba(255, 100, 0, 0.15)")
    cellGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
    
    ctx.fillStyle = cellGrad
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw some solar prominence patterns
  ctx.strokeStyle = "rgba(255, 255, 200, 0.15)"
  ctx.lineWidth = 2
  for (let i = 0; i < 15; i++) {
    ctx.beginPath()
    const yStart = Math.random() * 256
    ctx.moveTo(0, yStart)
    ctx.bezierCurveTo(128, yStart + 50 - Math.random() * 100, 384, yStart + 50 - Math.random() * 100, 512, yStart)
    ctx.stroke()
  }
  
  return new THREE.CanvasTexture(c)
}

function generateSaturnRingTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas")
  c.width = 512
  c.height = 8
  const ctx = c.getContext("2d")!
  const grad = ctx.createLinearGradient(0, 0, 512, 0)
  grad.addColorStop(0.00, "rgba(0,0,0,0)")
  grad.addColorStop(0.05, "rgba(135,115,85,0.22)") // C ring
  grad.addColorStop(0.18, "rgba(205,180,135,0.88)") // B ring inner
  grad.addColorStop(0.30, "rgba(225,200,158,0.96)") // B ring bright
  grad.addColorStop(0.42, "rgba(182,158,116,0.78)") // B ring outer
  grad.addColorStop(0.46, "rgba(55,45,35,0.08)")   // Cassini Division
  grad.addColorStop(0.51, "rgba(192,168,128,0.72)") // A ring
  grad.addColorStop(0.67, "rgba(175,152,112,0.55)") // A ring outer
  grad.addColorStop(0.82, "rgba(148,128,92,0.28)")  // F ring faint
  grad.addColorStop(1.00, "rgba(0,0,0,0)")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 8)
  return new THREE.CanvasTexture(c)
}

// ─────────────────────────────────────────────
// AXIAL TILTS (in radians)
// ─────────────────────────────────────────────
const PLANET_TILT: Record<PlanetType, number> = {
  sun:     (7.25 * Math.PI) / 180,
  mercury: 0.03,
  venus:   (177.4 * Math.PI) / 180, // near upside-down retrograde
  earth:   (23.5 * Math.PI) / 180,
  mars:    (25.2 * Math.PI) / 180,
  jupiter: (3.1  * Math.PI) / 180,
  saturn:  (26.7 * Math.PI) / 180,
  uranus:  (97.8 * Math.PI) / 180, // rotates on its side
  neptune: (28.3 * Math.PI) / 180,
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export function PlanetRenderer({ planetType, state }: PlanetRendererProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rotSpeedRef = useRef(0.003)

  // Update rotation speed based on timer state
  useEffect(() => {
    switch (state) {
      case "idle":    rotSpeedRef.current = 0.0020; break
      case "running": rotSpeedRef.current = 0.0080; break
      case "paused":  rotSpeedRef.current = 0.0005; break
      case "success": rotSpeedRef.current = 0.0180; break
    }
  }, [state])

  // Rebuild Three.js scene whenever planet changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(256, 256)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    
    // Adjust camera distance to prevent clipping (especially for Saturn's rings)
    if (planetType === "saturn") {
      camera.position.z = 7.8
    } else if (planetType === "uranus") {
      camera.position.z = 5.2
    } else if (planetType === "earth") {
      camera.position.z = 3.6
    } else {
      camera.position.z = 3.5
    }

    // Group to hold the planet sphere, rings, and clouds as a single cohesive unit
    const planetGroup = new THREE.Group()
    scene.add(planetGroup)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.12)
    scene.add(ambient)
    const sunLight = new THREE.DirectionalLight(0xfffcf0, 1.45)
    sunLight.position.set(-3, 1.5, 2)
    scene.add(sunLight)
    const fillLight = new THREE.DirectionalLight(0x3355aa, 0.08)
    fillLight.position.set(3, -1, -2)
    scene.add(fillLight)

    // Planet sphere (scaled down to 0.8)
    const geo = new THREE.SphereGeometry(0.8, 64, 64)
    const textureLoader = new THREE.TextureLoader()
    
    let tex: THREE.Texture
    let mat: THREE.Material
    
    if (planetType === "sun") {
      tex = generateSunTexture()
      mat = new THREE.MeshBasicMaterial({
        map: tex,
      })
    } else {
      tex = textureLoader.load(PLANET_TEXTURES[planetType])
      mat = new THREE.MeshPhongMaterial({
        map: tex,
        shininess: planetType === "venus" ? 25 : 6,
        specular: new THREE.Color(0x0d0d0d),
      })
    }

    const sphere = new THREE.Mesh(geo, mat)
    sphere.rotation.z = PLANET_TILT[planetType]
    planetGroup.add(sphere)

    // Earth cloud layer (scaled down to 0.816)
    let cloudMesh: THREE.Mesh | null = null
    let cloudTex: THREE.Texture | null = null
    if (planetType === "earth") {
      const cloudGeo = new THREE.SphereGeometry(0.816, 64, 64)
      cloudTex = textureLoader.load("/textures/earthcloudmap.jpg")
      const cloudMat = new THREE.MeshPhongMaterial({
        map: cloudTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.88,
        depthWrite: false,
      })
      cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)
      cloudMesh.rotation.z = PLANET_TILT["earth"]
      planetGroup.add(cloudMesh)
    }

    // Saturn ring system (scaled down to 80%)
    let saturnRing: THREE.Mesh | null = null
    if (planetType === "saturn") {
      const innerR = 1.30 * 0.8
      const outerR = 2.42 * 0.8
      const ringGeo = new THREE.RingGeometry(innerR, outerR, 256)

      // Remap UV
      const pos = ringGeo.attributes.position
      const uv  = ringGeo.attributes.uv
      const v3  = new THREE.Vector3()
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i)
        const r = Math.sqrt(v3.x * v3.x + v3.y * v3.y)
        uv.setXY(i, (r - innerR) / (outerR - innerR), 0)
      }
      uv.needsUpdate = true

      const ringTex = generateSaturnRingTexture()
      const ringMat = new THREE.MeshBasicMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
      })
      saturnRing = new THREE.Mesh(ringGeo, ringMat)
      saturnRing.rotation.x = Math.PI / 2
      saturnRing.rotation.y = PLANET_TILT["saturn"]
      planetGroup.add(saturnRing)
    }

    // Uranus rings (scaled down to 80%)
    let uranusRing: THREE.Mesh | null = null
    if (planetType === "uranus") {
      const ringGeo = new THREE.RingGeometry(1.38 * 0.8, 1.55 * 0.8, 128)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x88d8e8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      })
      uranusRing = new THREE.Mesh(ringGeo, ringMat)
      uranusRing.rotation.x = Math.PI / 2
      uranusRing.rotation.z = PLANET_TILT["uranus"]
      planetGroup.add(uranusRing)
    }

    // ─────────────────────────────────────────────
    // DRAG & ROTATION CONTROLS (Pointer events)
    // ─────────────────────────────────────────────
    let isDragging = false
    let prevX = 0
    let prevY = 0
    let velX = 0
    let velY = 0

    const onPointerDown = (e: PointerEvent) => {
      if (state === "running") return // drag disabled during focus session
      isDragging = true
      prevX = e.clientX
      prevY = e.clientY
      velX = 0
      velY = 0
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevX
      const deltaY = e.clientY - prevY

      // Rotate group on Y (horizontal) and X (vertical)
      planetGroup.rotation.y += deltaX * 0.006
      planetGroup.rotation.x += deltaY * 0.006

      velX = deltaX * 0.006
      velY = deltaY * 0.006

      prevX = e.clientX
      prevY = e.clientY
    }

    const onPointerUp = () => {
      isDragging = false
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    // Animation loop
    let animId: number
    const tick = () => {
      animId = requestAnimationFrame(tick)

      if (isDragging) {
        // Handled by pointermove
      } else {
        // Apply inertia friction/damping
        planetGroup.rotation.y += velX
        planetGroup.rotation.x += velY
        velX *= 0.94
        velY *= 0.94

        // Drift vertical rotation back to center to maintain proper orientation over time
        planetGroup.rotation.x *= 0.96

        // Normal spin
        sphere.rotation.y += rotSpeedRef.current
        if (saturnRing) saturnRing.rotation.z += rotSpeedRef.current * 0.4
        if (uranusRing) uranusRing.rotation.z += rotSpeedRef.current * 0.3
      }

      // Independent clouds speed rotation (Bumi)
      if (cloudMesh) {
        cloudMesh.rotation.y += rotSpeedRef.current * 1.15
      }

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)

      geo.dispose()
      mat.dispose()
      tex.dispose()
      if (cloudMesh) {
        cloudMesh.geometry.dispose()
        ;(cloudMesh.material as THREE.Material).dispose()
        if (cloudTex) cloudTex.dispose()
      }
      if (saturnRing) {
        saturnRing.geometry.dispose()
        ;(saturnRing.material as THREE.Material).dispose()
      }
      if (uranusRing) {
        uranusRing.geometry.dispose()
        ;(uranusRing.material as THREE.Material).dispose()
      }
      renderer.dispose()
    }
  }, [planetType, state])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        display: "block",
        width: "256px",
        height: "256px",
        pointerEvents: state === "running" ? "none" : "auto",
        cursor: state === "running" ? "default" : "grab",
      }}
    />
  )
}
