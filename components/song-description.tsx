"use client"

import { Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SongDescriptionProps {
  title: string
  artist: string
  description: string
  color?: string
}

export default function SongDescription({ title, artist, description, color = "pink" }: SongDescriptionProps) {
  // Determinar el color de la barra lateral
  const getBorderColor = () => {
    if (color.includes("pink")) return "border-l-pink-500"
    if (color.includes("purple")) return "border-l-purple-500"
    if (color.includes("blue")) return "border-l-blue-500"
    if (color.includes("green")) return "border-l-green-500"
    if (color.includes("yellow")) return "border-l-yellow-500"
    if (color.includes("red")) return "border-l-red-500"
    return "border-l-pink-500"
  }

  return (
    <Card className="mt-6 overflow-hidden animate-fade-in-up">
      <CardContent className={`p-0 flex`}>
        <div className={`w-2 ${getBorderColor()}`}></div>
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-pink-500" fill="#ec4899" />
            <h4 className="font-medium text-gray-800">Dedicatoria para "{title}"</h4>
          </div>

          <p className="text-gray-600 italic leading-relaxed whitespace-pre-line">{description}</p>

          <p className="text-right text-sm text-gray-500 mt-2">- {artist}</p>
        </div>
      </CardContent>
    </Card>
  )
}
