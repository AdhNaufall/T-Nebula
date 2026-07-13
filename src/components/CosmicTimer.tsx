import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Square, Settings } from "lucide-react"
import { CosmicStar, type CosmicState } from "./CosmicStar"
import { GravityField } from "./GravityField"
import { SettingsModal } from "./SettingsModal"
import { useSettings } from "../hooks/useSettings"
import { SparkleTrail } from "./SparkleTrail"
import { WarpTransition } from "./WarpTransition"

const STATE_LABELS: Record<CosmicState, string> = {
  idle:    "Orbital Hold — Select your planet and ignite",
  running: "Deep Orbit — Flow state active",
  paused:  "Gravity Drift — Focus disrupted",
  success: "Aphelion Reached — Mission complete",
}

// Stable starfield memoized outside component to prevent re-render shifts
const STARFIELD = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: `${(i * 37 + 11) % 100}%`,
  left: `${(i * 53 + 7) % 100}%`,
  size: ((i * 13 + 5) % 3) + 1,
  delay: `${(i * 7) % 40 / 10}s`,
  opacity: ((i * 17 + 3) % 5) / 10 + 0.2,
}))

export function CosmicTimer() {
  const { settings, updateDuration, updatePlanetType } = useSettings()
  const [timerState, setTimerState] = useState<CosmicState>('idle')
  const [timeLeft, setTimeLeft] = useState(settings.duration * 60)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [prevDuration, setPrevDuration] = useState(settings.duration)
  const [isWarping, setIsWarping] = useState(false)

  const triggerWarpTransition = (action: () => void) => {
    setIsWarping(true)
    setTimeout(() => {
      action()
    }, 450)
    setTimeout(() => {
      setIsWarping(false)
    }, 900)
  }

  // Track mouse coordinates for parallax space backgrounds
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 2 // range -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2 // range -1 to 1
      document.documentElement.style.setProperty("--mx", `${x}`)
      document.documentElement.style.setProperty("--my", `${y}`)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // When settings change and timer is idle, reset timeLeft
  useEffect(() => {
    if (settings.duration !== prevDuration) {
      setPrevDuration(settings.duration)
      if (timerState === 'idle') {
        setTimeLeft(settings.duration * 60)
      }
    }
  }, [settings.duration, timerState, prevDuration])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (timerState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timerState === 'running' && timeLeft === 0) {
      setTimerState('success')
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerState, timeLeft])

  const toggleTimer = () => {
    if (timerState === 'idle' || timerState === 'paused') {
      setTimerState('running')
    } else if (timerState === 'running') {
      setTimerState('paused')
    }
  }

  const resetTimer = () => {
    setTimerState('idle')
    setTimeLeft(settings.duration * 60)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const progressPercent = useMemo(() => {
    const total = settings.duration * 60
    return total > 0 ? ((total - timeLeft) / total) * 100 : 0
  }, [timeLeft, settings.duration])

  // Dynamic accent color per planet
  const accentColor: Record<string, string> = {
    sun:     "#ff5500",
    mercury: "#c0b8b0",
    venus:   "#f0b858",
    earth:   "#66FCF1",
    mars:    "#E07A5F",
    jupiter: "#d08040",
    saturn:  "#e8c070",
    uranus:  "#88e8e8",
    neptune: "#5878e0",
  }
  const accent = accentColor[settings.planetType] ?? "#66FCF1"

  const handleOpenSettings = () => {
    // Only allow opening settings when idle or paused
    if (timerState !== 'running') {
      setIsSettingsOpen(true)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-space-900 text-white overflow-hidden">

      {/* ── Parallax Starfield & Nebulae ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-space-900">
        {/* Nebulae Gas Cloud 1 (Dynamic color matching planet accent) */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[70vw] h-[70vh] rounded-full opacity-[0.22] blur-[130px] pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(circle, ${accent}88 0%, rgba(13,15,35,0) 70%)`,
            transform: "translate(calc(var(--mx) * -15px), calc(var(--my) * -15px))",
            transition: "background 0.8s ease",
          }}
        />

        {/* Nebulae Gas Cloud 2 (Deep Space Violet/Indigo) */}
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vh] rounded-full opacity-[0.16] blur-[150px] pointer-events-none mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(7,11,25,0) 75%)",
            transform: "translate(calc(var(--mx) * 12px), calc(var(--my) * 12px))",
          }}
        />

        {/* Layer 1: Deep Stars (Slower, tiny) */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: "translate(calc(var(--mx) * -8px), calc(var(--my) * -8px))",
          }}
        >
          {STARFIELD.filter((s) => s.id % 3 === 0).map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full bg-white/70"
              style={{
                top: s.top,
                left: s.left,
                width: "1px",
                height: "1px",
                opacity: s.opacity * 0.8,
              }}
            />
          ))}
        </div>

        {/* Layer 2: Midground Stars (Medium, glowing) */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: "translate(calc(var(--mx) * -20px), calc(var(--my) * -20px))",
          }}
        >
          {STARFIELD.filter((s) => s.id % 3 === 1).map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{
                top: s.top,
                left: s.left,
                width: `${s.size}px`,
                height: `${s.size}px`,
                boxShadow: "0 0 4px rgba(255, 255, 255, 0.4)",
                opacity: s.opacity,
              }}
            />
          ))}
        </div>

        {/* Layer 3: Foreground Stars (Faster, bright) */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: "translate(calc(var(--mx) * -38px), calc(var(--my) * -38px))",
          }}
        >
          {STARFIELD.filter((s) => s.id % 3 === 2).map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full bg-cyan-200"
              style={{
                top: s.top,
                left: s.left,
                width: `${s.size + 0.5}px`,
                height: `${s.size + 0.5}px`,
                boxShadow: "0 0 6px rgba(103, 232, 249, 0.5)",
                opacity: s.opacity * 1.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Sparkle Mouse Drag Trail ── */}
      <SparkleTrail color={accent} />

      {/* ── Space Warp Transition Overlay ── */}
      <WarpTransition active={isWarping} color={accent} />

      {/* ── Main UI Content Wrapper (stretches/blurs on warp) ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-full"
        animate={{
          scale: isWarping ? 1.25 : 1,
          filter: isWarping ? "blur(8px)" : "blur(0px)",
          opacity: isWarping ? 0.35 : 1,
          rotate: isWarping ? 2 : 0,
        }}
        transition={{
          duration: 0.9,
          ease: "easeInOut",
        }}
      >

      {/* ── Header ── */}
      <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-8 z-10">
        <div>
          <h1
            className="text-2xl font-bold tracking-[0.3em] uppercase"
            style={{
              background: `linear-gradient(90deg, ${accent}, white, ${accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            T-NEBULA
          </h1>
          <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">
            {STATE_LABELS[timerState]}
          </p>
        </div>

        {/* Settings gear */}
        <button
          onClick={handleOpenSettings}
          title={timerState === 'running' ? "Pause first to change settings" : "Mission Configuration"}
          className="group p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30"
          disabled={timerState === 'running'}
        >
          <Settings
            className="w-5 h-5 text-gray-400 group-hover:text-white transition-all group-hover:rotate-45 duration-500"
          />
        </button>
      </div>

      {/* ── Cosmic Visualization + Gravity Field ── */}
      <div className="relative flex items-center justify-center z-10 my-4">
        {/* Circular progress ring behind the star */}
        <svg
          className="absolute"
          width="320"
          height="320"
          viewBox="0 0 320 320"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="160"
            cy="160"
            r="145"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1.5"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="145"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 145}`}
            strokeDashoffset={`${2 * Math.PI * 145 * (1 - progressPercent / 100)}`}
            style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Gravity field particles */}
        <GravityField key={settings.planetType} active={timerState === 'running'} planetType={settings.planetType} />

        {/* The star */}
        <CosmicStar state={timerState} starType={settings.planetType} />
      </div>

      {/* ── Timer Display ── */}
      <div className="relative z-10 mb-10">
        <h2
          className="text-7xl md:text-9xl font-bold tracking-tighter tabular-nums select-none"
          style={{
            fontFamily: "'Orbitron', 'Space Grotesk', monospace",
            color: "white",
            textShadow: `0 0 30px ${accent}60`,
          }}
        >
          {formatTime(timeLeft)}
        </h2>
        {/* Progress text */}
        <p className="text-center text-xs text-gray-600 mt-2 tabular-nums">
          {settings.duration} min session · {Math.round(progressPercent)}% complete
        </p>
      </div>

      {/* ── Controls ── */}
      <div className="relative z-10 flex items-center gap-5">
        {/* Reset */}
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95"
          title="Reset"
        >
          <Square className="w-5 h-5 text-gray-300" />
        </button>

        {/* Main play/pause - larger */}
        <button
          onClick={toggleTimer}
          disabled={timerState === 'success'}
          className="group relative p-5 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          style={{
            backgroundColor: `${accent}10`,
            borderColor: `${accent}50`,
            boxShadow: `0 0 30px ${accent}30`,
          }}
        >
          {timerState === 'running' ? (
            <Pause className="w-9 h-9 text-[#E07A5F]" />
          ) : (
            <Play className="w-9 h-9 ml-1" style={{ color: accent }} />
          )}
        </button>

        {/* Settings shortcut (mobile friendly — duplicate at bottom) */}
        <button
          onClick={handleOpenSettings}
          disabled={timerState === 'running'}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* ── Success overlay message ── */}
      {timerState === 'success' && (
        <motion.div
          className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-sm text-gray-400 tracking-wide">
            Session complete. Aphelion reached.
          </p>
          <button
            onClick={resetTimer}
            className="px-6 py-2 text-sm rounded-full border border-white/20 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            style={{ color: accent }}
          >
            Begin New Cycle →
          </button>
        </motion.div>
      )}

      </motion.div>

      {/* ── Settings Modal ── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateDuration={(d) => triggerWarpTransition(() => updateDuration(d))}
        onUpdatePlanetType={(p) => triggerWarpTransition(() => updatePlanetType(p))}
      />
    </div>
  )
}
