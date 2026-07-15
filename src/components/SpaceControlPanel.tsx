import { motion, AnimatePresence } from "framer-motion"
import { X, Volume2, VolumeX, Sparkles, Star } from "lucide-react"

interface SpaceControlPanelProps {
  isOpen: boolean
  onClose: () => void
  accent: string
  
  // Sound controls
  isSoundOn: boolean
  onToggleSound: () => void
  soundVolume: number
  onChangeVolume: (vol: number) => void
  
  // Visual controls
  isSparklesOn: boolean
  onToggleSparkles: () => void
  isShootingStarsOn: boolean
  onToggleShootingStars: () => void
}

export function SpaceControlPanel({
  isOpen,
  onClose,
  accent,
  isSoundOn,
  onToggleSound,
  soundVolume,
  onChangeVolume,
  isSparklesOn,
  onToggleSparkles,
  isShootingStarsOn,
  onToggleShootingStars,
}: SpaceControlPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (invisible clicks to close) */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel Card */}
          <motion.div
            className="fixed bottom-24 right-4 md:right-10 z-50 w-80 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(13,15,35,0.95) 0%, rgba(7,11,25,0.98) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `0 15px 40px rgba(0,0,0,0.7), 0 0 30px ${accent}0e`,
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Glow Bar */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}aa, transparent)`,
              }}
            />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase">
                    Space Calibration
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                    Audio &amp; Visual Controls
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sound Calibration */}
              <div className="mb-4 p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    {isSoundOn ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-500" />
                    )}
                    Ambient Sound
                  </span>
                  
                  {/* Toggle Button */}
                  <button
                    onClick={onToggleSound}
                    className="relative w-8 h-4.5 rounded-full p-0.5 transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: isSoundOn ? `${accent}88` : "rgba(255,255,255,0.08)",
                      boxShadow: isSoundOn ? `0 0 8px ${accent}40` : "none",
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full bg-white transition-all duration-300"
                      style={{
                        transform: isSoundOn ? "translateX(14px)" : "translateX(0px)",
                      }}
                    />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={soundVolume}
                    disabled={!isSoundOn}
                    onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{
                      background: isSoundOn
                        ? `linear-gradient(to right, ${accent} 0%, ${accent} ${soundVolume * 100}%, rgba(255,255,255,0.1) ${soundVolume * 100}%, rgba(255,255,255,0.1) 100%)`
                        : "rgba(255,255,255,0.1)",
                      accentColor: accent,
                    }}
                  />
                  <span className="text-[10px] text-gray-400 tabular-nums w-6 text-right">
                    {Math.round(soundVolume * 100)}%
                  </span>
                </div>
              </div>

              {/* Visual Toggles */}
              <div className="flex flex-col gap-2">
                {/* Mouse Sparkles */}
                <button
                  onClick={onToggleSparkles}
                  className="flex items-center justify-between p-3 rounded-xl border transition-all duration-300 text-left cursor-pointer"
                  style={{
                    backgroundColor: isSparklesOn ? `${accent}0a` : "rgba(255,255,255,0.01)",
                    borderColor: isSparklesOn ? `${accent}30` : "rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: isSparklesOn ? accent : "#6b7280" }} />
                    <span className="text-xs font-semibold text-gray-200 uppercase tracking-wide">Mouse Dust Trail</span>
                  </div>
                  <div
                    className="relative w-8 h-4.5 rounded-full p-0.5 transition-all duration-300"
                    style={{
                      backgroundColor: isSparklesOn ? `${accent}88` : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full bg-white transition-all duration-300"
                      style={{
                        transform: isSparklesOn ? "translateX(14px)" : "translateX(0px)",
                      }}
                    />
                  </div>
                </button>

                {/* Shooting Stars */}
                <button
                  onClick={onToggleShootingStars}
                  className="flex items-center justify-between p-3 rounded-xl border transition-all duration-300 text-left cursor-pointer"
                  style={{
                    backgroundColor: isShootingStarsOn ? `${accent}0a` : "rgba(255,255,255,0.01)",
                    borderColor: isShootingStarsOn ? `${accent}30` : "rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" style={{ color: isShootingStarsOn ? accent : "#6b7280" }} />
                    <span className="text-xs font-semibold text-gray-200 uppercase tracking-wide">Shooting Stars</span>
                  </div>
                  <div
                    className="relative w-8 h-4.5 rounded-full p-0.5 transition-all duration-300"
                    style={{
                      backgroundColor: isShootingStarsOn ? `${accent}88` : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full bg-white transition-all duration-300"
                      style={{
                        transform: isShootingStarsOn ? "translateX(14px)" : "translateX(0px)",
                      }}
                    />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
