"use client"

import { useRef } from "react"

interface WaveVisualizerProps {
  audioData: number[]
  isPlaying: boolean
}

export default function WaveVisualizer({ audioData, isPlaying }: WaveVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Crear barras para el visualizador
  const renderBars = () => {
    // Si no hay datos de audio o no está reproduciendo, mostrar barras estáticas
    if (!isPlaying || audioData.length === 0) {
      return Array(20)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-1 mx-0.5 rounded-full bg-white/50"
            style={{
              height: `${Math.random() * 20 + 5}px`,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))
    }

    // Usar los datos de audio para crear barras dinámicas
    // Tomamos muestras espaciadas para tener un número razonable de barras
    const step = Math.ceil(audioData.length / 20)
    const bars = []

    for (let i = 0; i < audioData.length; i += step) {
      if (bars.length >= 20) break

      const value = audioData[i]
      const height = (value / 255) * 50 + 3 // Normalizar a un rango de altura razonable

      bars.push(
        <div
          key={i}
          className="w-1 mx-0.5 rounded-full bg-white/70"
          style={{
            height: `${height}px`,
            transition: "height 0.1s ease",
          }}
        />,
      )
    }

    return bars
  }

  return (
    <div ref={containerRef} className="flex items-end justify-center h-16 w-full px-4">
      {renderBars()}
    </div>
  )
}
