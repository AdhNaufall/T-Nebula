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

      {/* 3D Planet — rendered via Three.js */}
      <PlanetRenderer planetType={starType} state={state} />

      {/* Orbiting particle dust cloud (visible when running) */}
      {state === "running" && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: "3px",
                height: "3px",
                backgroundColor: cfg.particleColor,
                top: "50%",
                left: "50%",
                translateX: "-50%",
                translateY: "-50%",
                boxShadow: `0 0 4px ${cfg.particleColor}`,
              }}
              initial={{
                x: Math.cos((i * 36) * (Math.PI / 180)) * 115,
                y: Math.sin((i * 36) * (Math.PI / 180)) * 115,
                opacity: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: [0, 0.85, 0],
                scale: [1, 0.4, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
