import { motion } from "framer-motion"

interface ConstellationStar {
  x: number
  y: number
  name?: string
  main?: boolean
}

interface ConstellationDef {
  stars: ConstellationStar[]
  connections: [number, number][]
}

const CONSTELLATIONS: ConstellationDef[] = [
  // Ursa Major (Big Dipper) - Top Right
  {
    stars: [
      { x: 1450, y: 180, name: "Dubhe", main: true },
      { x: 1510, y: 210, name: "Merak" },
      { x: 1560, y: 240, name: "Phecda" },
      { x: 1600, y: 280, name: "Megrez" },
      { x: 1680, y: 260, name: "Alioth" },
      { x: 1720, y: 340, name: "Mizar" },
      { x: 1640, y: 340, name: "Alkaid" },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 3],
    ],
  },
  // Orion (The Hunter) - Bottom Left
  {
    stars: [
      { x: 220, y: 720, name: "Betelgeuse", main: true },
      { x: 370, y: 750, name: "Bellatrix" },
      { x: 250, y: 820, name: "Alnilam" },
      { x: 280, y: 830, name: "Alnitak" },
      { x: 310, y: 840, name: "Mintaka" },
      { x: 230, y: 930, name: "Saiph" },
      { x: 350, y: 910, name: "Rigel", main: true },
      { x: 290, y: 650, name: "Meissa" },
    ],
    connections: [
      [0, 7],
      [1, 7],
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
      [5, 6],
    ],
  },
  // Cassiopeia (W-shape) - Top Left
  {
    stars: [
      { x: 280, y: 150, name: "Segin" },
      { x: 330, y: 200, name: "Ruchbah" },
      { x: 380, y: 170, name: "Gamma Cas", main: true },
      { x: 420, y: 230, name: "Schedar" },
      { x: 480, y: 180, name: "Caph" },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  // Cygnus (Swan / Northern Cross) - Bottom Right
  {
    stars: [
      { x: 1580, y: 720, name: "Deneb", main: true },
      { x: 1510, y: 780, name: "Sadr" },
      { x: 1430, y: 850, name: "Albireo" },
      { x: 1410, y: 740, name: "Gienah" },
      { x: 1610, y: 820, name: "Fawaris" },
    ],
    connections: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
  },
]

interface ConstellationsProps {
  accent: string
}

export function Constellations({ accent }: ConstellationsProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Glow filter definitions */}
      <defs>
        <filter id="constellation-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {CONSTELLATIONS.map((constellation, idx) => (
        <g key={idx}>
          {/* Render Vector Connection Lines */}
          {constellation.connections.map(([startIdx, endIdx], lineIdx) => {
            const start = constellation.stars[startIdx]
            const end = constellation.stars[endIdx]
            return (
              <motion.line
                key={lineIdx}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={accent}
                strokeWidth="0.8"
                opacity="0.16"
                style={{
                  filter: `drop-shadow(0 0 2px ${accent}40)`,
                }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2.5,
                  delay: idx * 0.4 + lineIdx * 0.1,
                  ease: "easeInOut",
                }}
              />
            )
          })}

          {/* Render Constellation Star Nodes */}
          {constellation.stars.map((star, starIdx) => (
            <g key={starIdx}>
              {/* Pulsing Outer Ring for Major Stars */}
              {star.main && (
                <motion.circle
                  cx={star.x}
                  cy={star.y}
                  r="6"
                  fill="none"
                  stroke={accent}
                  strokeWidth="0.5"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.15, 0.4, 0.15],
                  }}
                  transition={{
                    duration: 3 + (starIdx % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Star Core Dot */}
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={star.main ? "2.5" : "1.5"}
                fill={star.main ? "white" : `${accent}bb`}
                style={{
                  filter: star.main ? "url(#constellation-glow)" : "none",
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2 + (starIdx % 2),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: starIdx * 0.2,
                }}
              />

              {/* Minor Technical Coordinates Overlay Label */}
              {star.main && star.name && (
                <text
                  x={star.x + 8}
                  y={star.y - 4}
                  fill="rgba(255, 255, 255, 0.25)"
                  className="font-mono text-[8px] tracking-wider pointer-events-none select-none uppercase"
                >
                  {star.name}
                </text>
              )}
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}
