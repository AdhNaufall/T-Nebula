import { useState, useEffect } from "react"
import { motion, type Variants } from "framer-motion"
import { cn } from "../lib/utils"
import type { PlanetType } from "../hooks/useSettings"
import { PlanetRenderer } from "./PlanetRenderer"

export type CosmicState = "idle" | "running" | "paused" | "success"

// Per-planet visual configs for the corona / glow / particles
const PLANET_CONFIGS: Record<
  PlanetType,
  {
    idleCorona: string
    runningCorona: string
    pulseDuration: number
    particleColor: string
  }
> = {
  sun: {
    idleCorona:    "#b04000",
    runningCorona: "#ff6600",
    pulseDuration: 1.2,
    particleColor: "#ffd700",
  },
  mercury: {
    idleCorona:    "#606060",
    runningCorona: "#b0a8a0",
    pulseDuration: 4,
    particleColor: "#c8c0b8",
  },
  venus: {
    idleCorona:    "#b08030",
    runningCorona: "#f0b858",
    pulseDuration: 3,
    particleColor: "#f0d080",
  },
  earth: {
    idleCorona:    "#1a5f8a",
    runningCorona: "#66FCF1",
    pulseDuration: 2.5,
    particleColor: "#66FCF1",
  },
  mars: {
    idleCorona:    "#7a2a10",
    runningCorona: "#E07A5F",
    pulseDuration: 2.8,
    particleColor: "#f09070",
  },
  jupiter: {
    idleCorona:    "#7a5025",
    runningCorona: "#d08040",
    pulseDuration: 1.6,
    particleColor: "#e8b070",
  },
  saturn: {
    idleCorona:    "#907040",
    runningCorona: "#e8c070",
    pulseDuration: 1.8,
    particleColor: "#f0d898",
  },
  uranus: {
    idleCorona:    "#309090",
    runningCorona: "#88e8e8",
    pulseDuration: 3.5,
    particleColor: "#a0f0f0",
  },
  neptune: {
    idleCorona:    "#1a30a0",
    runningCorona: "#4060cc",
    pulseDuration: 2.2,
    particleColor: "#6888e8",
  },
}

interface CosmicStarProps {
  state: CosmicState
  starType?: PlanetType
  className?: string
}

export function CosmicStar({
  state,
  starType = "earth",
  className,
}: CosmicStarProps) {
  const cfg = PLANET_CONFIGS[starType]
  const [showIgniteWave, setShowIgniteWave] = useState(false)

  useEffect(() => {
    if (state === "running") {
      setShowIgniteWave(true)
      const timer = setTimeout(() => setShowIgniteWave(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [state])

  const coronaVariants: Variants = {
    idle: {
      scale: [1, 1.04, 1],
      opacity: [0.25, 0.45, 0.25],
      filter: "blur(22px)",
      backgroundColor: cfg.idleCorona,
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } as never,
    },
    running: {
      scale: [1, 1.12, 1],
      opacity: [0.5, 0.85, 0.5],
      filter: "blur(32px)",
      backgroundColor: cfg.runningCorona,
      transition: {
        duration: cfg.pulseDuration,
        repeat: Infinity,
        ease: "easeInOut",
      } as never,
    },
    paused: {
      scale: [1.1, 1.18, 1.1],
      opacity: [0.45, 0.65, 0.45],
      filter: "blur(40px)",
      backgroundColor: "#c85030",
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } as never,
    },
    success: {
      scale: [1.4, 1.35, 1.4],
      opacity: [0.75, 0.95, 0.75],
      filter: "blur(18px)",
      backgroundColor: "#ffffff",
      transition: { duration: 4, repeat: Infinity, ease: "linear" } as never,
    },
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-64 h-64",
        className,
      )}
    >
      {/* Outer atmospheric glow */}
      <motion.div
        className="absolute w-52 h-52 rounded-full"
        variants={coronaVariants}
        initial="idle"
        animate={state}
      />

      {/* Success — supernova burst ring */}
      {state === "success" && (
        <motion.div
          className="absolute rounded-full border border-yellow-300/60"
          style={{ width: 220, height: 220 }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Ignite / Play — shockwave pulse ring */}
      {showIgniteWave && (
        <motion.div
          className="absolute rounded-full border-2"
          style={{ 
            borderColor: cfg.particleColor,
            boxShadow: `0 0 15px ${cfg.particleColor}`,
            width: 200, 
            height: 200 
          }}
          initial={{ scale: 0.7, opacity: 0.9 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      )}

      {/* 3D Planet — rendered via Three.js */}
      <PlanetRenderer planetType={starType} state={state} />

      {/* Orbiting particle dust cloud (visible when running) */}
      {state === "running" && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(15)].map((_, i) => {
            const angle = (i * (360 / 15)) * (Math.PI / 180)
            const radius = 95 + (i % 3) * 12
            const speed = 2.5 + (i % 4) * 0.6
            const size = 2 + (i % 2)
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  position: "absolute",
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: cfg.particleColor,
                  top: "50%",
                  left: "50%",
                  boxShadow: `0 0 5px ${cfg.particleColor}`,
                  x: Math.cos(angle) * radius,
                  y: Math.sin(angle) * radius,
                  transformOrigin: `${-Math.cos(angle) * radius}px ${-Math.sin(angle) * radius}px`,
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: speed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * -0.15,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
