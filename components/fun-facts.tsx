"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

const funFacts = [
  "Nuestra canción especial es la que sonaba en la radio la primera vez que nos dijimos 'Te amo'.",
  "Hemos compartido más de 1,000 comidas juntos desde que comenzamos nuestra relación.",
  "El lugar donde tuvimos nuestra primera cita ahora es nuestro restaurante favorito.",
  "Hemos tomado más de 500 fotos juntos en nuestros viajes y aventuras.",
  "Nuestra primera película juntos fue una comedia romántica que aún vemos cada aniversario.",
  "El primer regalo que nos dimos el uno al otro aún lo conservamos como un tesoro especial.",
  "Hemos caminado juntos más de 100 kilómetros en nuestros paseos románticos.",
  "Nuestra primera conversación duró más de 3 horas sin que nos diéramos cuenta del tiempo.",
]

export default function FunFacts() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const showNextFact = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-pink-200 shadow-md">
      <CardContent className="p-6 text-center">
        <h3 className="text-xl font-bold text-pink-600 mb-4">¿Sabías que...?</h3>
        <div
          className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
          style={{ minHeight: "60px" }}
        >
          <p className="text-gray-700 italic mb-4 leading-relaxed">{funFacts[currentFactIndex]}</p>
        </div>
        <Button
          onClick={showNextFact}
          variant="outline"
          className="border-pink-300 text-pink-600 hover:bg-pink-50"
          disabled={isAnimating}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnimating ? "animate-spin" : ""}`} />
          Mostrar siguiente dato curioso
        </Button>
      </CardContent>
    </Card>
  )
}
