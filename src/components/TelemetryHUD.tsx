import { useState, useEffect } from "react"
import type { CosmicState } from "./CosmicStar"
import type { PlanetType } from "../hooks/useSettings"

interface TelemetryHUDProps {
  planetType: PlanetType
  state: CosmicState
  accent: string
}

// Planet specifics for NASA stats
const PLANET_STATS: Record<PlanetType, { gravity: string; pressure: string; baseVelocity: number }> = {
  sun:     { gravity: "27.90 G", pressure: "N/A (Plasma)", baseVelocity: 220.0 },
  mercury: { gravity: "0.38 G",  pressure: "10^-14 bar",   baseVelocity: 47.36 },
  venus:   { gravity: "0.90 G",  pressure: "92.0 bar",     baseVelocity: 35.02 },
  earth:   { gravity: "1.00 G",  pressure: "1.013 bar",    baseVelocity: 29.78 },
  mars:    { gravity: "0.38 G",  pressure: "0.006 bar",    baseVelocity: 24.07 },
  jupiter: { gravity: "2.53 G",  pressure: ">1000 bar",    baseVelocity: 13.07 },
  saturn:  { gravity: "1.06 G",  pressure: ">1000 bar",    baseVelocity: 9.68 },
  uranus:  { gravity: "0.89 G",  pressure: ">1000 bar",    baseVelocity: 6.80 },
  neptune: { gravity: "1.14 G",  pressure: ">1000 bar",    baseVelocity: 5.43 },
}

export function TelemetryHUD({ planetType, state, accent }: TelemetryHUDProps) {
  const stats = PLANET_STATS[planetType] ?? PLANET_STATS.earth
  
  // Real-time fluctuating states
  const [velocity, setVelocity] = useState(stats.baseVelocity)
  const [energy, setEnergy] = useState(98.4)
  const [coords, setCoords] = useState({ ra: "00h 00m 00s", dec: "+00° 00' 00\"" })

  // Fluctuating stats loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuating velocity
      const velOffset = (Math.random() - 0.5) * (stats.baseVelocity * 0.004)
      setVelocity(Number((stats.baseVelocity + velOffset).toFixed(3)))

      // Fluctuating energy grid
      setEnergy((prev) => {
        const offset = (Math.random() - 0.5) * 0.2
        return Number(Math.max(90, Math.min(100, prev + offset)).toFixed(1))
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [planetType, stats.baseVelocity])

  // Track coordinates based on mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const xPct = e.clientX / innerWidth
      const yPct = e.clientY / innerHeight

      // Map to RA (0 to 24 hours)
      const raHours = Math.floor(xPct * 24)
      const raMinutes = Math.floor((xPct * 24 % 1) * 60)
      const raSeconds = Math.floor(((xPct * 24 % 1) * 60 % 1) * 60)

      // Map to DEC (-90 to +90 degrees)
      const decDeg = Math.floor(yPct * 180 - 90)
      const decMin = Math.abs(Math.floor((yPct * 180 % 1) * 60))
      const decSec = Math.abs(Math.floor(((yPct * 180 % 1) * 60 % 1) * 60))

      const sign = decDeg >= 0 ? "+" : ""
      setCoords({
        ra: `${raHours.toString().padStart(2, "0")}h ${raMinutes.toString().padStart(2, "0")}m ${raSeconds.toString().padStart(2, "0")}s`,
        dec: `${sign}${decDeg}° ${decMin.toString().padStart(2, "0")}' ${decSec.toString().padStart(2, "0")}"`,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // State text helpers
  const missionStatusText = {
    idle: "ORBITAL HOLD (STANDBY)",
    running: "DEEP SPACE INCUBATION (ACTIVE)",
    paused: "GRAVITATIONAL DRIFT (PAUSED)",
    success: "APHELION REACHED (COMPLETE)",
  }[state]

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 select-none font-mono text-[9px] text-gray-500 tracking-wider">
      {/* ── TOP SECTION ── */}
      <div className="flex justify-between w-full">
        {/* Top Left: System Connection & State */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-white/[0.03] bg-black/10 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-bold">COMM_LINK: SECURE</span>
          </div>
          <div>STATUS: <span style={{ color: accent }} className="font-bold">{missionStatusText}</span></div>
          <div>SECTOR: <span className="text-gray-300">T-NEBULA / SEC-09</span></div>
        </div>

        {/* Top Right: Real-time Telemetry Stats */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-white/[0.03] bg-black/10 backdrop-blur-xs text-right">
          <div>ORBITAL_VEL: <span className="text-gray-300 font-bold">{velocity} km/s</span></div>
          <div>WARP_DRIVE: <span style={{ color: state === "running" ? accent : "#9ca3af" }} className="font-bold">{state === "running" ? "ENGAGED" : "STANDBY"}</span></div>
          <div>ENERGY_GRID: <span className="text-gray-300">{energy}%</span></div>
        </div>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="flex justify-between w-full">
        {/* Bottom Left: Planet Physics Specs */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-white/[0.03] bg-black/10 backdrop-blur-xs">
          <div className="text-gray-400 font-bold uppercase tracking-widest border-b border-white/5 pb-1 mb-0.5">
            Target Physics Specs
          </div>
          <div>GRAVITATIONAL_CONSTANT: <span className="text-gray-300">{stats.gravity}</span></div>
          <div>ATMOSPHERE_PRESSURE: <span className="text-gray-300">{stats.pressure}</span></div>
          <div>TARGET_LOCK: <span className="text-emerald-400 font-bold">LOCKED</span></div>
        </div>

        {/* Bottom Right: Sensor Coordinate Output */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-white/[0.03] bg-black/10 backdrop-blur-xs text-right">
          <div className="text-gray-400 font-bold uppercase tracking-widest border-b border-white/5 pb-1 mb-0.5">
            Active Coordinate Feed
          </div>
          <div>RIGHT_ASCENSION: <span className="text-gray-300 font-bold">{coords.ra}</span></div>
          <div>DECLINATION: <span className="text-gray-300 font-bold">{coords.dec}</span></div>
          <div>REF_FRAME: <span className="text-gray-300">ICRS / J2000.0</span></div>
        </div>
      </div>
    </div>
  )
}
