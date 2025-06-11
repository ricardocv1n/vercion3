"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Play, Calendar } from "lucide-react"

interface MediaItem {
  id: number
  title: string
  date: string
  description: string
  src: string
  thumbnail?: string
  type: "photo" | "video"
  category: "momentos" | "viajes" | "celebraciones" | "aventuras" | "cotidiano"
  likes: number
  aspectRatio?: "square" | "portrait" | "landscape" // Nueva propiedad para controlar la proporción
}

interface MediaCardProps {
  item: MediaItem
  onOpen: () => void
  onLike: () => void
  isLiked: boolean
}

export default function MediaCard({ item, onOpen, onLike, isLiked }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLikeAnimation(true)
    setTimeout(() => setLikeAnimation(false), 600)
    onLike()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "momentos":
        return "bg-pink-500"
      case "viajes":
        return "bg-blue-500"
      case "celebraciones":
        return "bg-purple-500"
      case "aventuras":
        return "bg-green-500"
      case "cotidiano":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Determinar la clase de aspect ratio basada en la propiedad o usar un valor aleatorio si no está definida
  const getAspectRatioClass = () => {
    if (item.aspectRatio) {
      switch (item.aspectRatio) {
        case "portrait":
          return "aspect-[2/3]"
        case "landscape":
          return "aspect-[3/2]"
        default:
          return "aspect-square"
      }
    } else {
      // Si no se proporciona, asignar aleatoriamente para efecto Pinterest
      const ratios = ["aspect-square", "aspect-[2/3]", "aspect-[3/2]"]
      return ratios[item.id % ratios.length]
    }
  }

  return (
    <Card
      className={`
        group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl w-full
        ${isHovered ? "scale-[1.02] -rotate-1" : "scale-100"}
        ${imageLoaded ? "opacity-100" : "opacity-0"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
    >
      <div className={`relative ${getAspectRatioClass()} overflow-hidden`}>
        {/* Image/Video thumbnail */}
        <Image
          src={item.thumbnail || item.src || "/placeholder.svg?height=300&width=300"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Video play overlay */}
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="h-8 w-8 text-gray-700 ml-1" />
            </div>
          </div>
        )}

        {/* Category badge */}
        <div
          className={`absolute top-2 left-2 ${getCategoryColor(item.category)} text-white text-xs px-2 py-1 rounded-full`}
        >
          {item.category}
        </div>

        {/* Like button */}
        <Button
          variant="ghost"
          size="icon"
          className={`
            absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white/90 rounded-full
            ${likeAnimation ? "animate-bounce" : ""}
          `}
          onClick={handleLike}
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              isLiked ? "text-pink-500 fill-pink-500" : "text-gray-600"
            } ${likeAnimation ? "animate-pulse" : ""}`}
          />
        </Button>

        {/* Info overlay */}
        <div
          className={`
          absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4
          transition-transform duration-300 ${isHovered ? "translate-y-0" : "translate-y-full"}
        `}
        >
          <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white/80 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(item.date).toLocaleDateString("es-ES")}
            </div>
            <div className="flex items-center text-white/80 text-xs">
              <Heart className="h-3 w-3 mr-1" />
              {item.likes}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
