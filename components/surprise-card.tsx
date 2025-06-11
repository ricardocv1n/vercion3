"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Lock, Unlock, Sparkles } from "lucide-react"

export interface Surprise {
  id: number
  title: string
  description: string
  type: "message" | "video" | "album" | "poem" | "gift" | "memory"
  icon: string
  color: string
  isUnlocked: boolean
  unlockDate?: string
  content: any
  previewImage?: string
}

interface SurpriseCardProps {
  surprise: Surprise
  onOpen: () => void
  onUnlock: () => void
  index: number
}

export default function SurpriseCard({ surprise, onOpen, onUnlock, index }: SurpriseCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animación de entrada escalonada
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 200)

    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    if (isHovered && surprise.isUnlocked) {
      setShowSparkles(true)
      const timer = setTimeout(() => setShowSparkles(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isHovered, surprise.isUnlocked])

  const getIcon = () => {
    switch (surprise.type) {
      case "message":
        return "💌"
      case "video":
        return "🎬"
      case "album":
        return "📸"
      case "poem":
        return "📝"
      case "gift":
        return "🎁"
      case "memory":
        return "💭"
      default:
        return "✨"
    }
  }

  const getGradientClass = () => {
    switch (surprise.color) {
      case "pink":
        return "from-pink-400 to-rose-500"
      case "purple":
        return "from-purple-400 to-indigo-500"
      case "blue":
        return "from-blue-400 to-cyan-500"
      case "green":
        return "from-green-400 to-emerald-500"
      case "yellow":
        return "from-yellow-400 to-orange-500"
      case "red":
        return "from-red-400 to-pink-500"
      default:
        return "from-pink-400 to-rose-500"
    }
  }

  return (
    <Card
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${surprise.isUnlocked ? "ring-2 ring-pink-300 ring-opacity-50" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={surprise.isUnlocked ? onOpen : onUnlock}
    >
      {/* Sparkles effect */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <Sparkles
              key={i}
              className={`absolute text-yellow-400 animate-ping`}
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
              size={16}
            />
          ))}
        </div>
      )}

      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass()} opacity-10`} />

      {/* Lock overlay for locked surprises */}
      {!surprise.isUnlocked && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-12 h-12 text-white/80 mx-auto mb-2" />
            <p className="text-white/80 text-sm font-medium">Toca para desbloquear</p>
          </div>
        </div>
      )}

      <CardContent className="p-6 relative z-5">
        <div className="text-center">
          {/* Icon */}
          <div className="text-6xl mb-4 relative">
            {getIcon()}
            {surprise.isUnlocked && (
              <div className="absolute -top-2 -right-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Unlock className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">{surprise.title}</h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{surprise.description}</p>

          {/* Action button */}
          <Button
            className={`
              w-full transition-all duration-300
              ${
                surprise.isUnlocked
                  ? "bg-pink-600 hover:bg-pink-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }
              ${isHovered ? "scale-105" : "scale-100"}
            `}
          >
            <Heart className="w-4 h-4 mr-2" />
            {surprise.isUnlocked ? "Abrir Sorpresa" : "Desbloquear"}
          </Button>

          {/* Unlock date */}
          {surprise.unlockDate && (
            <p className="text-xs text-gray-500 mt-2">
              {surprise.isUnlocked ? "Desbloqueada" : "Disponible"}: {surprise.unlockDate}
            </p>
          )}
        </div>
      </CardContent>

      {/* Floating hearts animation */}
      {isHovered && surprise.isUnlocked && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-400 animate-bounce opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "2s",
              }}
              size={12}
              fill="currentColor"
            />
          ))}
        </div>
      )}
    </Card>
  )
}
