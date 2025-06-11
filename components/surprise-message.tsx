"use client"

import { Heart, Quote } from "lucide-react"

interface SurpriseMessageProps {
  content: {
    title: string
    message: string
    author: string
    date: string
    image?: string
  }
}

export default function SurpriseMessage({ content }: SurpriseMessageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {content.image && (
        <div className="mb-6 text-center">
          <img
            src={content.image || "/placeholder.svg?height=300&width=400"}
            alt="Imagen del mensaje"
            className="rounded-lg shadow-lg mx-auto max-h-64 object-cover"
          />
        </div>
      )}

      <div className="bg-white rounded-lg p-6 shadow-lg border border-pink-100">
        <div className="text-center mb-6">
          <Quote className="w-8 h-8 text-pink-400 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h3>
          <p className="text-sm text-gray-500">{content.date}</p>
        </div>

        <div className="prose prose-lg mx-auto text-center">
          <p className="text-gray-700 leading-relaxed italic text-lg font-serif whitespace-pre-line">
            "{content.message}"
          </p>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
            <span className="text-pink-600 font-medium">Con amor, {content.author}</span>
            <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  )
}
