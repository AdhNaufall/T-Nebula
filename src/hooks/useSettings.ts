import { useState } from "react"

export type PlanetType =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"

// Keep backward-compatible alias so nothing else breaks
export type StarType = PlanetType

export interface Settings {
  duration: number   // in minutes
  planetType: PlanetType
}

const DEFAULT_SETTINGS: Settings = {
  duration: 25,
  planetType: "earth",
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  const updateDuration = (duration: number) => {
    setSettings((prev) => ({ ...prev, duration }))
  }

  const updatePlanetType = (planetType: PlanetType) => {
    setSettings((prev) => ({ ...prev, planetType }))
  }

  return { settings, updateDuration, updatePlanetType }
}
