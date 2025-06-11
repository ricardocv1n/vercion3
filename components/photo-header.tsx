"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"

interface PhotoHeaderProps {
  coupleImage: string
  relationshipStart: string
  totalPhotos: number
  totalVideos: number
}

export default function PhotoHeader({ coupleImage, relationshipStart, totalPhotos, totalVideos }: PhotoHeaderProps) {
  const [isHeartBeating, setIsHeartBeating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsHeartBeating(true)
      setTimeout(() => setIsHeartBeating(false), 600)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-lg border border-pink-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-rose-100/50" />

      {/* Floating hearts decoration */}
      <div className="absolute top-4 right-4 text-pink-200 text-2xl animate-pulse">💕</div>
      <div className="absolute bottom-4 left-4 text-pink-200 text-xl animate-bounce">💖</div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Profile image */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Image
              src={coupleImage || "/placeholder.svg?height=128&width=128"}
              alt="Nuestra foto de perfil"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">Nuestras Fotos</h1>

          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <Heart className={`h-5 w-5 text-pink-500 ${isHeartBeating ? "animate-ping" : ""}`} />
            <span className="text-gray-700 font-medium">
              Juntos desde el{" "}
              {new Date(relationshipStart).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <Heart className={`h-5 w-5 text-pink-500 ${isHeartBeating ? "animate-ping" : ""}`} />
          </div>

          <p className="text-gray-600 italic leading-relaxed mb-4 max-w-2xl">
            "Cada imagen cuenta una historia, cada momento capturado es un tesoro que guardamos en nuestro corazón. Aquí
            están los recuerdos más hermosos de nuestro amor, momentos que nos hacen sonreír y recordar por qué nuestro
            amor es tan especial."
          </p>

          <div className="flex justify-center md:justify-start gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{totalPhotos}</div>
              <div className="text-sm text-gray-600">Fotos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalVideos}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalPhotos + totalVideos}</div>
              <div className="text-sm text-gray-600">Recuerdos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
