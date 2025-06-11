"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import AnniversaryCounter from "@/components/anniversary-counter"
import EnhancedCarousel from "@/components/enhanced-carousel"

interface CarouselItem {
  id: number
  image: string
  title: string
  description: string
}

export default function InicioPage() {
  const router = useRouter()
  const [anniversaryDate, setAnniversaryDate] = useState<Date | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userName, setUserName] = useState("Mi Amor")

  // Example carousel items
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      image: "/placeholder.svg?height=400&width=600",
      title: "Un paseo inolvidable 🌳",
      description: "Momentos que atesoramos en el corazón",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=400&width=600",
      title: "Nuestro primer día juntos",
      description: "El día que comenzó nuestra hermosa historia",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=400&width=600",
      title: "Celebrando nuestro amor",
      description: "Un día especial lleno de momentos mágicos",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=400&width=600",
      title: "Atardecer en la playa",
      description: "Contemplando juntos la belleza del horizonte",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=400&width=600",
      title: "Nuestra primera cita",
      description: "Donde todo comenzó a florecer",
    },
  ]

  useEffect(() => {
    // Check if anniversary date exists in localStorage
    const storedDate = localStorage.getItem("anniversaryDate")
    if (!storedDate) {
      router.push("/")
      return
    }

    setAnniversaryDate(new Date(storedDate))

    // Get user name if stored
    const storedName = localStorage.getItem("userName")
    if (storedName) {
      setUserName(storedName)
    }
  }, [router])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (!anniversaryDate) {
    return null // Loading state or redirect will happen
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <PageHeader title={`¡Bienvenida ${userName}!`} />

      <div className="mb-10 flex flex-col items-center">
        <div className="max-w-3xl w-full mb-8">
          <Card className="bg-gradient-to-r from-pink-50 to-pink-100 border-none shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-pink-600 text-center mb-6">Nuestro Tiempo Juntos</h2>
              <AnniversaryCounter anniversaryDate={anniversaryDate} />
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Así comenzó todo:</h2>
          <EnhancedCarousel items={carouselItems} autoPlayInterval={6000} />
        </div>
      </div>

      <div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">Nuestro Rincón de Amor</h2>
        <p className="text-center mb-6">
          Este es nuestro espacio especial para guardar y revivir todos los momentos mágicos que hemos compartido
          juntos. Cada foto, cada mensaje y cada canción es un tesoro que nos recuerda lo especial que es nuestro amor.
        </p>
        <blockquote className="border-l-4 border-pink-400 pl-4 italic text-gray-600 my-4">
          "El amor no se mide por cuánto tiempo lo has esperado, sino por cuánto estás dispuesto a esperar por él."
        </blockquote>
      </div>

      <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-md flex items-center gap-2 z-10">
        <p className="text-sm font-medium">Nuestra canción del día</p>
        <p className="text-xs text-muted-foreground">Tu Vida en la Mía - Marc Anthony</p>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
