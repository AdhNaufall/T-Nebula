import { useEffect, useRef } from "react"

interface SparkleTrailProps {
  color: string // Current active planet accent color
}

interface Sparkle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  decay: number
  rotation: number
  spin: number
}

// Helper to convert hex colors to RGB values safely
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "")
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return isNaN(r) || isNaN(g) || isNaN(b) ? { r: 102, g: 252, b: 241 } : { r, g, b }
}

export function SparkleTrail({ color }: SparkleTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMouseDownRef = useRef(false)
  const mousePosRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let sparkles: Sparkle[] = []

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()

    // Event listeners
    const handlePointerDown = (e: PointerEvent) => {
      isMouseDownRef.current = true
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      // Explosion of sparkles on click
      spawnSparkles(e.clientX, e.clientY, 12)
    }

    const handlePointerMove = (e: PointerEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      // Always spawn 1 sparkle on hover, and 4 when actively dragging
      const count = isMouseDownRef.current ? 4 : 1
      spawnSparkles(e.clientX, e.clientY, count)
    }

    const handlePointerUp = () => {
      isMouseDownRef.current = false
    }

    const spawnSparkles = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        // If mouse is down, make particles fly faster/further
        const speed = (isMouseDownRef.current ? 1.0 : 0.4) + Math.random() * (isMouseDownRef.current ? 2.5 : 1.2)
        sparkles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.1, // slightly float up
          size: Math.random() * (isMouseDownRef.current ? 4 : 2.5) + 1.2,
          alpha: 1.0,
          decay: 0.015 + Math.random() * 0.02,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.06,
        })
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
    window.addEventListener("resize", resize)

    // Draw loop
    const draw = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, width, height)

      // Draw active sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i]
        s.x += s.vx
        s.y += s.vy
        s.alpha -= s.decay
        s.rotation += s.spin

        if (s.alpha <= 0) {
          sparkles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.rotation)
        ctx.globalAlpha = s.alpha

        // Setup glowing color gradient
        ctx.shadowBlur = 8
        ctx.shadowColor = color
        ctx.fillStyle = "#ffffff"

        // Draw a four-pointed star (sparkle)
        ctx.beginPath()
        const r = s.size
        ctx.moveTo(0, -r)
        ctx.quadraticCurveTo(0, 0, r, 0)
        ctx.quadraticCurveTo(0, 0, 0, r)
        ctx.quadraticCurveTo(0, 0, -r, 0)
        ctx.quadraticCurveTo(0, 0, 0, -r)
        ctx.closePath()
        ctx.fill()

        ctx.restore()
      }

      // Draw ambient light glow under cursor (brighter when mouse is pressed)
      const { x, y } = mousePosRef.current
      const { r, g, b } = hexToRgb(color)
      const radius = isMouseDownRef.current ? 120 : 60
      const opacity = isMouseDownRef.current ? 0.16 : 0.06

      const spotlight = ctx.createRadialGradient(x, y, 0, x, y, radius)
      spotlight.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`)
      spotlight.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
      
      ctx.fillStyle = spotlight
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("resize", resize)
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  )
}
