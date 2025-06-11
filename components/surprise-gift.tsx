"use client"

import { Gift, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SurpriseGiftProps {
  content: {
    title: string
    description: string
    giftType: "virtual" | "physical" | "experience"
    image?: string
    instructions?: string
    value?: string
  }
}

export default function SurpriseGift({ content }: SurpriseGiftProps) {
  const getGiftIcon = () => {
    switch (content.giftType) {
      case "virtual":
        return "💝"
      case "physical":
        return "🎁"
      case "experience":
        return "🎪"
      default:
        return "🎁"
    }
  }

  const getGiftTypeLabel = () => {
    switch (content.giftType) {
      case "virtual":
        return "Regalo Virtual"
      case "physical":
        return "Regalo Físico"
      case "experience":
        return "Experiencia"
      default:
        return "Regalo"
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-8 shadow-lg border border-yellow-100">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{getGiftIcon()}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h3>
          <span className="inline-block px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
            {getGiftTypeLabel()}
          </span>
        </div>

        {content.image && (
          <div className="mb-6 text-center">
            <img
              src={content.image || "/placeholder.svg?height=300&width=400"}
              alt="Regalo"
              className="rounded-lg shadow-md mx-auto max-h-64 object-cover"
            />
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-gray-700 text-lg leading-relaxed">{content.description}</p>
        </div>

        {content.value && (
          <div className="text-center mb-6 p-4 bg-white/70 rounded-lg">
            <p className="text-orange-700 font-medium">Valor estimado: {content.value}</p>
          </div>
        )}

        {content.instructions && (
          <div className="bg-white/70 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Instrucciones especiales:
            </h4>
            <p className="text-gray-700 text-sm">{content.instructions}</p>
          </div>
        )}

        <div className="text-center">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Gift className="w-4 h-4 mr-2" />
            Reclamar Regalo
          </Button>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
            <span className="text-orange-600 font-medium">Hecho especialmente para ti</span>
            <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  )
}
