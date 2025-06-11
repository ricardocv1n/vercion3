"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Heart, Download, Share2 } from "lucide-react"
import type { Surprise } from "./surprise-card"
import SurpriseMessage from "./surprise-message"
import SurpriseVideo from "./surprise-video"
import SurpriseAlbum from "./surprise-album"
import SurprisePoem from "./surprise-poem"
import SurpriseGift from "./surprise-gift"
import SurpriseMemory from "./surprise-memory"

interface SurpriseModalProps {
  isOpen: boolean
  onClose: () => void
  surprise: Surprise | null
}

export default function SurpriseModal({ isOpen, onClose, surprise }: SurpriseModalProps) {
  const [showContent, setShowContent] = useState(false)
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && surprise) {
      // Delay content reveal for dramatic effect
      const timer = setTimeout(() => {
        setShowContent(true)
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3000)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
      setConfetti(false)
    }
  }, [isOpen, surprise])

  const renderSurpriseContent = () => {
    if (!surprise || !showContent) return null

    switch (surprise.type) {
      case "message":
        return <SurpriseMessage content={surprise.content} />
      case "video":
        return <SurpriseVideo content={surprise.content} />
      case "album":
        return <SurpriseAlbum content={surprise.content} />
      case "poem":
        return <SurprisePoem content={surprise.content} />
      case "gift":
        return <SurpriseGift content={surprise.content} />
      case "memory":
        return <SurpriseMemory content={surprise.content} />
      default:
        return <div>Contenido no disponible</div>
    }
  }

  const getGradientClass = () => {
    if (!surprise) return "from-pink-50 to-rose-100"

    switch (surprise.color) {
      case "pink":
        return "from-pink-50 to-rose-100"
      case "purple":
        return "from-purple-50 to-indigo-100"
      case "blue":
        return "from-blue-50 to-cyan-100"
      case "green":
        return "from-green-50 to-emerald-100"
      case "yellow":
        return "from-yellow-50 to-orange-100"
      case "red":
        return "from-red-50 to-pink-100"
      default:
        return "from-pink-50 to-rose-100"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Confetti effect */}
        {confetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-pink-400 animate-bounce"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className={`relative bg-gradient-to-r ${getGradientClass()} p-6 border-b`}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full hover:rotate-90 transition-transform duration-300"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {surprise && (
            <div className="pr-12">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{surprise.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{surprise.title}</h2>
                  <p className="text-gray-600">{surprise.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!showContent ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" fill="currentColor" />
                <p className="text-gray-600 text-lg">Preparando tu sorpresa...</p>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-up">{renderSurpriseContent()}</div>
          )}
        </div>

        {/* Footer */}
        {showContent && (
          <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
              <span>Con todo mi amor</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
