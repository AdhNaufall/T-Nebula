import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface WarpTransitionProps {
  active: boolean
  color: string
}

interface Star {
  x: number
  y: number
  z: number
  px: number
  py: number
}

export function WarpTransition({ active, color }: WarpTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const stars: Star[] = []
    const numStars = 150
    const speed = 45 // Fast warp speed

    // Initialize stars
    const initStar = (star: Partial<Star> = {}): Star => {
      const angle = Math.random() * Math.PI * 2
      const distance = 20 + Math.random() * 200
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        z: Math.random() * 1000 + 200,
        px: 0,
        py: 0,
        ...star,
      }
    }

    for (let i = 0; i < numStars; i++) {
      stars.push(initStar({ z: Math.random() * 1000 }))
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const tick = () => {
      ctx.fillStyle = "rgba(10, 11, 25, 0.25)" // Trails effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      stars.forEach((s, idx) => {
        s.z -= speed

        if (s.z <= 0) {
          stars[idx] = initStar()
          return
        }

        // Project 3D to 2D
        const px = (s.x / s.z) * 1000 + cx
        const py = (s.y / s.z) * 1000 + cy

        // Draw streak line if we have previous positions
        if (s.px !== 0 && s.py !== 0 && px > 0 && px < canvas.width && py > 0 && py < canvas.height) {
          ctx.strokeStyle = color
          ctx.lineWidth = Math.min(2.5, (1000 / s.z) * 1.5)
          ctx.beginPath()
          ctx.moveTo(s.px, s.py)
          ctx.lineTo(px, py)
          ctx.stroke()
        }

        s.px = px
        s.py = py
      })

      animId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [active, color])

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Warp Stars Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ mixBlendMode: "screen" }}
          />

          {/* Flash / Light Warp Overlay */}
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.45, 0.8, 0.45, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, times: [0, 0.2, 0.45, 0.75, 1], ease: "easeInOut" }}
            style={{
              background: `radial-gradient(circle, ${color}33 0%, rgba(13,15,35,0.95) 75%)`,
            }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
