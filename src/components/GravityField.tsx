import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

interface Particle {
  id: number
  baseX: number
  baseY: number
  size: number
  color: string
  opacity: number
  speed: number
}

const COLORS = ["#66FCF1", "#a5f3fc", "#e0f2fe", "#ffffff", "#67e8f9"]

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI + Math.random() * 0.5
    const radius = 90 + Math.random() * 60
    return {
      id: i,
      baseX: Math.cos(angle) * radius,
      baseY: Math.sin(angle) * radius,
      size: Math.random() * 3 + 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.6 + 0.3,
      speed: Math.random() * 0.04 + 0.02,
    }
  })
}

interface GravityFieldProps {
  active: boolean
}

export function GravityField({ active }: GravityFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles] = useState(() => generateParticles(18))
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smoothed mouse values via spring physics
  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  const [gravX, setGravX] = useState(0)
  const [gravY, setGravY] = useState(0)

  useEffect(() => {
    const unsubX = smoothMouseX.on("change", v => setGravX(v))
    const unsubY = smoothMouseY.on("change", v => setGravY(v))
    return () => { unsubX(); unsubY() }
  }, [smoothMouseX, smoothMouseY])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // Offset from center, normalized
    const dx = (e.clientX - cx) / rect.width
    const dy = (e.clientY - cy) / rect.height
    mouseX.set(dx * 70) // max 70px pull
    mouseY.set(dy * 70)
  }, [mouseX, mouseY])

  useEffect(() => {
    if (!active) return
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [active, handleMouseMove])

  if (!active) return null

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
    >
      {particles.map((p) => {
        // Each particle's position blends between its orbit base and the gravitational pull
        const pull = p.speed * 1 // how much each particle follows the mouse
        const targetX = p.baseX + gravX * pull * 12
        const targetY = p.baseY + gravY * pull * 12

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: targetX,
              y: targetY,
              opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.5],
            }}
            transition={{
              x: { type: "spring", stiffness: 30 + p.speed * 200, damping: 15 },
              y: { type: "spring", stiffness: 30 + p.speed * 200, damping: 15 },
              opacity: {
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.id * 0.1,
              },
            }}
          />
        )
      })}
    </div>
  )
}
