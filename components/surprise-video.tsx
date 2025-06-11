"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface SurpriseVideoProps {
  content: {
    title: string
    description: string
    videoUrl: string
    thumbnail?: string
    duration?: string
  }
}

export default function SurpriseVideo({ content }: SurpriseVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h3>
        <p className="text-gray-600">{content.description}</p>
        {content.duration && <p className="text-sm text-gray-500">Duración: {content.duration}</p>}
      </div>

      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
        {!isPlaying ? (
          <div className="relative w-full h-full cursor-pointer group" onClick={() => setIsPlaying(true)}>
            <img
              src={content.thumbnail || "/placeholder.svg?height=400&width=600"}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-gray-800 ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={content.videoUrl}
            title={content.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Un video especial creado con todo mi amor para ti 💕</p>
      </div>
    </div>
  )
}
