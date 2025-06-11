"use client"

import { useEffect, useState } from "react"
import EnhancedFloatingHearts from "./enhanced-floating-hearts"
import HeartsConfigurator from "./hearts-configurator"

export default function FloatingHearts() {
  const [config, setConfig] = useState({
    count: 30,
    minSize: 10,
    maxSize: 30,
    minSpeed: 1,
    maxSpeed: 3,
    interactive: true,
    colors: ["#ff80ab", "#ff4081", "#e91e63", "#f8bbd0", "#fce4ec"],
    density: "medium" as "low" | "medium" | "high",
    effects: {
      pulse: true,
      glow: true,
      swirl: true,
      parallax: true,
    },
  })

  // Load configuration from localStorage if available
  useEffect(() => {
    const savedConfig = localStorage.getItem("heartsConfig")
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (e) {
        console.error("Error parsing saved hearts configuration", e)
      }
    }
  }, [])

  return (
    <>
      <EnhancedFloatingHearts {...config} />
      <HeartsConfigurator config={config} onChange={setConfig} />
    </>
  )
}
