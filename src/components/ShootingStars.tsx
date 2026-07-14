import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface StarInstance {
  id: number
  x: number
  y: number
  length: number
  duration: number
  delay: number
}

interface ShootingStarsProps {
  color?: string
}

export function ShootingStars({ color = "#66FCF1" }: ShootingStarsProps) {
  const [stars, setStars] = useState<StarInstance[]>([])

  useEffect(() => {
    const spawnStar = () => {
      // Random coordinates: start from top-right area to fly down-left
      // Or general upper screen to bottom-left
      const newStar: StarInstance = {
        id: Date.now() + Math.random(),
        x: Math.random() * 70 + 20,          // 20vw to 90vw
        y: Math.random() * 30 + 5,           // 5vh to 35vh
        length: Math.random() * 80 + 70,     // 70px to 150px
        duration: Math.random() * 0.8 + 0.8, // 0.8s to 1.6s
        delay: Math.random() * 0.2,          // small random offset
      }
      
      setStars((prev) => {
        // Keep the list clean, remove old ones if array gets too large
        const kept = prev.filter((s) => Date.now() - s.id < 4000)
        return [...kept, newStar]
      })
    }

    // Organic spawn cycle: attempt to spawn a star every 2 seconds with an 85% success rate
    const interval = setInterval(() => {
      if (Math.random() < 0.85) {
        spawnStar()
      }
    }, 2000)

    // Initial delay stars for immediate atmospheric feel
    spawnStar()
    const initialTimer = setTimeout(() => {
      spawnStar()
    }, 800)

    return () => {
      clearInterval(interval)
      clearTimeout(initialTimer)
    }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              x: `${star.x}vw`,
              y: `${star.y}vh`,
              opacity: 0,
              scale: 0.2,
              rotate: -45,
              transformOrigin: "left center",
            }}
            animate={{
              // Travel along a 45-degree angle (down-left)
              x: `calc(${star.x}vw - 250px)`,
              y: `calc(${star.y}vh + 250px)`,
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.4, 1.0, 0.8, 0.1],
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              ease: [0.16, 1, 0.3, 1], // sleek custom easing for swift flight
            }}
            className="absolute rounded-full"
            style={{
              width: `${star.length}px`,
              height: "1.5px",
              background: `linear-gradient(90deg, ${color} 0%, rgba(255,255,255,0.8) 15%, rgba(255,255,255,0) 100%)`,
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
