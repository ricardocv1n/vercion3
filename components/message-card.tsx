"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Edit, Trash2, Calendar } from "lucide-react"

interface Message {
  id: number
  title: string
  content: string
  date: string
  category: "amor" | "motivacion" | "recuerdo" | "futuro" | "especial"
  isRead: boolean
}

interface MessageCardProps {
  message: Message
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  index: number
}

export default function MessageCard({ message, onClick, onEdit, onDelete, index }: MessageCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "amor":
        return "from-pink-50 to-rose-100 border-pink-200"
      case "motivacion":
        return "from-blue-50 to-indigo-100 border-blue-200"
      case "recuerdo":
        return "from-purple-50 to-violet-100 border-purple-200"
      case "futuro":
        return "from-green-50 to-emerald-100 border-green-200"
      case "especial":
        return "from-yellow-50 to-amber-100 border-yellow-200"
      default:
        return "from-gray-50 to-gray-100 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "amor":
        return "💕"
      case "motivacion":
        return "⭐"
      case "recuerdo":
        return "📸"
      case "futuro":
        return "🌟"
      case "especial":
        return "✨"
      default:
        return "💌"
    }
  }

  const getCardStyle = (index: number) => {
    const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"]
    return rotations[index % rotations.length]
  }

  return (
    <Card
      className={`
        cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
        bg-gradient-to-br ${getCategoryColor(message.category)}
        ${getCardStyle(index)}
        ${isHovered ? "rotate-0" : ""}
        relative overflow-hidden
        ${!message.isRead ? "ring-2 ring-pink-300 ring-opacity-50" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 text-2xl opacity-20">{getCategoryIcon(message.category)}</div>

      {/* Wax seal effect */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-pink-600 rounded-full opacity-80 flex items-center justify-center">
        <Heart className="h-4 w-4 text-white" />
      </div>

      {/* Vintage paper texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-serif">{message.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Calendar className="h-4 w-4 mr-1" />
              {message.date}
            </div>
          </div>
          {!message.isRead && <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />}
        </div>

        <p className="text-gray-700 text-sm line-clamp-3 font-serif leading-relaxed">{message.content}</p>

        {/* Action buttons */}
        <div
          className={`
            flex justify-end gap-2 mt-4 transition-opacity duration-200
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-pink-600 hover:bg-pink-50"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
