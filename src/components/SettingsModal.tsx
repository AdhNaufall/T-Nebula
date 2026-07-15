import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import type { Settings, PlanetType } from "../hooks/useSettings"

interface PlanetOption {
  type: PlanetType
  label: string
  description: string
  emoji: string
  accent: string
  glowColor: string
}

const PLANET_OPTIONS: PlanetOption[] = [
  {
    type: "sun",
    label: "Sun",
    emoji: "☀️",
    description: "The star at the center of our Solar System. Blazing heat, immense gravity — ultimate solar power focus.",
    accent: "#ff5500",
    glowColor: "#ff7700",
  },
  {
    type: "mercury",
    label: "Mercury",
    emoji: "⚫",
    description: "Closest to the Sun. Cratered, no atmosphere — ultra-minimal, raw focus.",
    accent: "#c0b8b0",
    glowColor: "#b0a8a0",
  },
  {
    type: "venus",
    label: "Venus",
    emoji: "🟡",
    description: "Shrouded in golden clouds. Intense heat, dense atmosphere — deep concentration.",
    accent: "#f0b858",
    glowColor: "#e0a840",
  },
  {
    type: "earth",
    label: "Earth",
    emoji: "🌍",
    description: "Blue marble, home planet. Oceans and life — balanced, clear-headed focus.",
    accent: "#66FCF1",
    glowColor: "#66FCF1",
  },
  {
    type: "mars",
    label: "Mars",
    emoji: "🔴",
    description: "The red planet. Dusty canyons, volcanic peaks — fierce, relentless energy.",
    accent: "#E07A5F",
    glowColor: "#E07A5F",
  },
  {
    type: "jupiter",
    label: "Jupiter",
    emoji: "🟠",
    description: "King of planets. Swirling storms, immense gravity — powerful, unstoppable drive.",
    accent: "#d08040",
    glowColor: "#c87030",
  },
  {
    type: "saturn",
    label: "Saturn",
    emoji: "🪐",
    description: "Lord of the rings. Majestic, methodical — elegant precision and long-game thinking.",
    accent: "#e8c070",
    glowColor: "#d8b060",
  },
  {
    type: "uranus",
    label: "Uranus",
    emoji: "🔵",
    description: "Ice giant, tilted on its side. Unique perspective — unconventional, lateral thinking.",
    accent: "#88e8e8",
    glowColor: "#70d8d8",
  },
  {
    type: "neptune",
    label: "Neptune",
    emoji: "🫐",
    description: "Farthest from the Sun. Deep blue, fierce winds — solitary, ultra-deep focus sessions.",
    accent: "#5878e0",
    glowColor: "#4060cc",
  },
]

const DURATION_PRESETS = [
  { label: "Short",    value: 15 },
  { label: "Pomodoro", value: 25 },
  { label: "Deep Work",value: 50 },
  { label: "Flow",     value: 90 },
]

interface PlanetCardProps {
  opt: PlanetOption
  selected: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function PlanetCard({ opt, selected, onClick, onMouseEnter, onMouseLeave }: PlanetCardProps) {
  const { label, emoji, accent, glowColor } = opt
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 focus:outline-none cursor-pointer group"
      style={{
        backgroundColor: selected ? `${glowColor}15` : "rgba(255,255,255,0.02)",
        borderColor: selected ? glowColor : "rgba(255,255,255,0.08)",
        boxShadow: selected
          ? `0 0 15px ${glowColor}30, inset 0 0 10px ${glowColor}10`
          : "none",
      }}
    >
      {/* Glow highlight on hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          border: `1px solid ${accent}40`,
          boxShadow: `0 0 12px ${accent}20`,
        }}
      />
      
      <span className="text-2xl mb-1.5 transition-transform duration-300 group-hover:scale-110">{emoji}</span>
      <span
        className="font-medium text-[11px] tracking-wide transition-colors duration-200"
        style={{ color: selected ? accent : "#d1d5db" }}
      >
        {label}
      </span>
      
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: accent }}
        >
          <Check className="w-2 h-2 text-black stroke-[3]" />
        </motion.div>
      )}
    </button>
  )
}

interface SettingsModalProps {
  isOpen: boolean
  settings: Settings
  onClose: () => void
  onUpdateDuration: (duration: number) => void
  onUpdatePlanetType: (planet: PlanetType) => void
}

export function SettingsModal({
  isOpen,
  settings,
  onClose,
  onUpdateDuration,
  onUpdatePlanetType,
}: SettingsModalProps) {
  const currentOpt = PLANET_OPTIONS.find((p) => p.type === settings.planetType)
  const accent = currentOpt?.accent ?? "#66FCF1"
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetOption | null>(null)
  const activePlanet = hoveredPlanet || currentOpt || PLANET_OPTIONS[3]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(13,15,35,0.97) 0%, rgba(7,11,25,0.99) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `0 25px 80px rgba(0,0,0,0.85), 0 0 60px ${accent}1a`,
                backdropFilter: "blur(40px)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header glow bar */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
                }}
              />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">
                      Mission Configuration
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Calibrate your focus parameters
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Duration Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Focus Duration
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={180}
                        value={settings.duration || ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value)
                          if (val > 0) {
                            onUpdateDuration(Math.min(180, val))
                          } else {
                            onUpdateDuration(0)
                          }
                        }}
                        onBlur={() => {
                          if (settings.duration < 1) {
                            onUpdateDuration(25)
                          }
                        }}
                        className="w-16 bg-white/5 border rounded-lg px-2 py-0.5 text-center text-sm font-bold focus:outline-none transition-all font-sans"
                        style={{
                          color: accent,
                          borderColor: `${accent}40`,
                        }}
                      />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        min
                      </span>
                    </div>
                  </div>

                  {/* Quick presets */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {DURATION_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => onUpdateDuration(preset.value)}
                        className="py-1.5 text-xs rounded-lg border transition-all duration-200 font-medium"
                        style={{
                          backgroundColor:
                            settings.duration === preset.value
                              ? `${accent}20`
                              : "rgba(255,255,255,0.03)",
                          borderColor:
                            settings.duration === preset.value
                              ? accent
                              : "rgba(255,255,255,0.08)",
                          color:
                            settings.duration === preset.value
                              ? accent
                              : "#9ca3af",
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Slider */}
                  <div className="relative">
                    <input
                      id="duration-slider"
                      type="range"
                      min={5}
                      max={90}
                      step={5}
                      value={settings.duration}
                      onChange={(e) => onUpdateDuration(Number(e.target.value))}
                      className="nebula-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${accent} 0%, ${accent} ${((settings.duration - 5) / 85) * 100}%, rgba(255,255,255,0.1) ${((settings.duration - 5) / 85) * 100}%, rgba(255,255,255,0.1) 100%)`,
                        accentColor: accent,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>5 min</span>
                    <span>90 min</span>
                  </div>
                </div>

                {/* Planet Selection */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    🪐 Destination Orbit
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLANET_OPTIONS.map((opt) => (
                      <PlanetCard
                        key={opt.type}
                        opt={opt}
                        selected={settings.planetType === opt.type}
                        onClick={() => onUpdatePlanetType(opt.type)}
                        onMouseEnter={() => setHoveredPlanet(opt)}
                        onMouseLeave={() => setHoveredPlanet(null)}
                      />
                    ))}
                  </div>
                </div>

                {/* Active Planet Details Panel */}
                <div 
                  className="mb-6 p-4 rounded-xl border transition-all duration-300 overflow-hidden relative"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.01)",
                    borderColor: `${activePlanet.glowColor}25`,
                    boxShadow: `inset 0 0 20px ${activePlanet.glowColor}05`,
                  }}
                >
                  <div 
                    className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-[35px] opacity-15 pointer-events-none transition-all duration-500"
                    style={{
                      background: activePlanet.accent,
                    }}
                  />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl transition-transform duration-300 transform scale-110">{activePlanet.emoji}</span>
                    <div>
                      <h3 
                        className="text-sm font-bold tracking-wider uppercase transition-colors duration-300"
                        style={{ color: activePlanet.accent }}
                      >
                        {activePlanet.label}
                      </h3>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest">
                        System Diagnostics
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed min-h-[54px] font-sans">
                    {activePlanet.description}
                  </p>
                </div>

                {/* Apply button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                    border: `1px solid ${accent}50`,
                    color: accent,
                    boxShadow: `0 0 20px ${accent}20`,
                  }}
                >
                  Apply &amp; Launch Mission
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
