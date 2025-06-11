"use client"

import { Heart, Calendar, MapPin } from "lucide-react"

interface SurpriseMemoryProps {
  content: {
    title: string
    description: string
    date: string
    location?: string
    story: string
    images?: string[]
    significance: string
  }
}

export default function SurpriseMemory({ content }: SurpriseMemoryProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 shadow-lg border border-blue-100">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">💭</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h3>
          <p className="text-gray-600">{content.description}</p>
        </div>

        <div className="flex justify-center gap-6 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{content.date}</span>
          </div>
          {content.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{content.location}</span>
            </div>
          )}
        </div>

        {content.images && content.images.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg?height=200&width=300"}
                  alt={`Recuerdo ${index + 1}`}
                  className="rounded-lg shadow-md w-full h-48 object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/70 rounded-lg p-6 mb-6">
          <h4 className="font-medium text-gray-800 mb-3">La Historia:</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content.story}</p>
        </div>

        <div className="bg-indigo-100/70 rounded-lg p-4">
          <h4 className="font-medium text-indigo-800 mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
            Por qué es especial:
          </h4>
          <p className="text-indigo-700 italic">{content.significance}</p>
        </div>
      </div>
    </div>
  )
}
