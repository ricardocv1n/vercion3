"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Heart, Calendar, Tag } from "lucide-react"

interface Message {
  id: number
  title: string
  content: string
  date: string
  category: "amor" | "motivacion" | "recuerdo" | "futuro" | "especial"
  isRead: boolean
}

interface MessageViewerProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  currentMessageId: number | null
  onNavigate: (direction: "prev" | "next") => void
  onMarkAsRead: (id: number) => void
}

export default function MessageViewer({
  isOpen,
  onClose,
  messages,
  currentMessageId,
  onNavigate,
  onMarkAsRead,
}: MessageViewerProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const currentMessage = messages.find((m) => m.id === currentMessageId)
  const currentIndex = messages.findIndex((m) => m.id === currentMessageId)

  useEffect(() => {
    if (currentMessage && !currentMessage.isRead) {
      onMarkAsRead(currentMessage.id)
    }
  }, [currentMessage, onMarkAsRead])

  const handleNavigate = (direction: "prev" | "next") => {
    setIsAnimating(true)
    setTimeout(() => {
      onNavigate(direction)
      setIsAnimating(false)
    }, 150)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "amor":
        return "Mensaje de Amor"
      case "motivacion":
        return "Motivación"
      case "recuerdo":
        return "Recuerdo Especial"
      case "futuro":
        return "Planes Futuros"
      case "especial":
        return "Momento Especial"
      default:
        return "Mensaje"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "amor":
        return "bg-pink-100 text-pink-800"
      case "motivacion":
        return "bg-blue-100 text-blue-800"
      case "recuerdo":
        return "bg-purple-100 text-purple-800"
      case "futuro":
        return "bg-green-100 text-green-800"
      case "especial":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!currentMessage) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-pink-50 to-rose-100 p-6 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="pr-12">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-pink-600" />
              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(currentMessage.category)}`}>
                {getCategoryLabel(currentMessage.category)}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 font-serif mb-2">{currentMessage.title}</h2>

            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              {currentMessage.date}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div
            className={`
              transition-all duration-300 
              ${isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}
            `}
          >
            {/* Decorative quote */}
            <div className="text-6xl text-pink-200 font-serif leading-none mb-4">"</div>

            <div
              className="text-gray-700 leading-relaxed font-serif text-lg"
              style={{
                fontFamily: "'Dancing Script', cursive, serif",
                lineHeight: "1.8",
              }}
            >
              {currentMessage.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="text-6xl text-pink-200 font-serif leading-none text-right">"</div>
          </div>

          {/* Signature area */}
          <div className="mt-8 pt-4 border-t border-pink-100">
            <div className="flex items-center justify-center">
              <Heart className="h-5 w-5 text-pink-500 mr-2" />
              <span className="text-pink-600 font-serif italic">Con todo mi amor</span>
              <Heart className="h-5 w-5 text-pink-500 ml-2" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6 bg-gray-50 border-t">
          <Button
            variant="outline"
            onClick={() => handleNavigate("prev")}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <span className="text-sm text-gray-500">
            {currentIndex + 1} de {messages.length}
          </span>

          <Button
            variant="outline"
            onClick={() => handleNavigate("next")}
            disabled={currentIndex === messages.length - 1}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
