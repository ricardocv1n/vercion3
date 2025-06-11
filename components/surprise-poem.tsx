"use client"

import { Heart, Feather } from "lucide-react"

interface SurprisePoemProps {
  content: {
    title: string
    poem: string
    author: string
    date: string
    dedication?: string
  }
}

export default function SurprisePoem({ content }: SurprisePoemProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 shadow-lg border border-purple-100">
        <div className="text-center mb-6">
          <Feather className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h3>
          <p className="text-sm text-gray-500">{content.date}</p>
        </div>

        {content.dedication && (
          <div className="text-center mb-6 p-4 bg-white/50 rounded-lg">
            <p className="text-purple-700 italic">{content.dedication}</p>
          </div>
        )}

        <div className="prose prose-lg mx-auto text-center">
          <div
            className="text-gray-700 leading-relaxed font-serif text-lg whitespace-pre-line"
            style={{ fontFamily: "'Dancing Script', cursive, serif" }}
          >
            {content.poem}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
            <span className="text-purple-600 font-medium italic">Escrito con amor por {content.author}</span>
            <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  )
}
