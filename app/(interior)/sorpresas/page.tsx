"use client"

import { useState, useEffect } from "react"
import PageHeader from "@/components/page-header"
import SurpriseCard from "@/components/surprise-card"
import SurpriseModal from "@/components/surprise-modal"
import { Heart, Sparkles } from "lucide-react"
import type { Surprise } from "@/components/surprise-card"

export default function SorpresasPage() {
  const [surprises, setSurprises] = useState<Surprise[]>([
    {
      id: 1,
      title: "Mensaje Secreto",
      description: "Un mensaje especial lleno de amor y cariño",
      type: "message",
      icon: "💌",
      color: "pink",
      isUnlocked: true,
      unlockDate: "Disponible ahora",
      content: {
        title: "Para Mi Amor Eterno",
        message: `Mi querido amor,

Cada día que pasa a tu lado es un regalo que atesoro con todo mi corazón. Desde el momento en que nuestros ojos se encontraron por primera vez, supe que mi vida había cambiado para siempre.

Eres la melodía que alegra mis mañanas, la luz que ilumina mis días más oscuros y la paz que abraza mis noches. En tus brazos he encontrado mi hogar, en tu sonrisa mi felicidad, y en tu amor mi razón de ser.

Gracias por ser mi compañera, mi confidente, mi mejor amiga y el amor de mi vida. Cada momento contigo es una página hermosa en el libro de nuestra historia.

Te amo más de lo que las palabras pueden expresar, más de lo que el tiempo puede medir, y más de lo que mi corazón puede contener.`,
        author: "Tu amor eterno",
        date: "14 de febrero, 2024",
        image: "/placeholder.svg?height=300&width=400",
      },
    },
    {
      id: 2,
      title: "Video Recopilatorio",
      description: "Un video especial con nuestros mejores momentos",
      type: "video",
      icon: "🎬",
      color: "purple",
      isUnlocked: true,
      unlockDate: "Disponible ahora",
      content: {
        title: "Nuestros Momentos Mágicos",
        description: "Un recopilatorio de los momentos más especiales que hemos vivido juntos",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Video de ejemplo
        thumbnail: "/placeholder.svg?height=400&width=600",
        duration: "3:45",
      },
    },
    {
      id: 3,
      title: "Álbum Digital",
      description: "Una colección de nuestras fotos más preciadas",
      type: "album",
      icon: "📸",
      color: "blue",
      isUnlocked: true,
      unlockDate: "Disponible ahora",
      content: {
        title: "Nuestros Recuerdos en Imágenes",
        description: "Una selección especial de las fotos que cuentan nuestra historia de amor",
        photos: [
          {
            id: 1,
            src: "/placeholder.svg?height=400&width=400",
            caption: "Nuestro primer encuentro",
            date: "15 de marzo, 2020",
          },
          {
            id: 2,
            src: "/placeholder.svg?height=400&width=400",
            caption: "Primera cita romántica",
            date: "22 de marzo, 2020",
          },
          {
            id: 3,
            src: "/placeholder.svg?height=400&width=400",
            caption: "Viaje a la playa",
            date: "10 de junio, 2020",
          },
          {
            id: 4,
            src: "/placeholder.svg?height=400&width=400",
            caption: "Celebrando nuestro aniversario",
            date: "15 de marzo, 2021",
          },
          {
            id: 5,
            src: "/placeholder.svg?height=400&width=400",
            caption: "Atardecer romántico",
            date: "5 de agosto, 2021",
          },
          {
            id: 6,
            src: "/placeholder.svg?height=400&width=400",
            caption: "Navidad en familia",
            date: "25 de diciembre, 2021",
          },
        ],
      },
    },
    {
      id: 4,
      title: "Poema Personalizado",
      description: "Versos escritos especialmente para ti",
      type: "poem",
      icon: "📝",
      color: "green",
      isUnlocked: false,
      unlockDate: "14 de febrero, 2025",
      content: {
        title: "Eres Mi Universo",
        poem: `En el silencio de la noche estrellada,
cuando el mundo duerme y todo calla,
mi corazón susurra tu nombre
y mi alma en tu amor se inflama.

Eres la luz que guía mi camino,
el puerto seguro en la tormenta,
la melodía que alegra mis días
y la paz que mi espíritu alienta.

En tus ojos veo el infinito,
en tu sonrisa encuentro el sol,
en tus brazos hallo mi refugio
y en tu amor, mi salvación.

Que este poema sea testimonio
de un amor que nunca morirá,
porque mientras mi corazón lata,
por siempre te amará.`,
        author: "Tu poeta enamorado",
        date: "San Valentín 2024",
        dedication: "Para la mujer que ilumina mi existencia",
      },
    },
    {
      id: 5,
      title: "Regalo Especial",
      description: "Una sorpresa material pensada especialmente para ti",
      type: "gift",
      icon: "🎁",
      color: "yellow",
      isUnlocked: false,
      unlockDate: "Próximamente",
      content: {
        title: "Cena Romántica Sorpresa",
        description:
          "Una cena romántica en tu restaurante favorito, con velas, música suave y tu plato preferido. Todo preparado para una noche inolvidable.",
        giftType: "experience" as const,
        image: "/placeholder.svg?height=300&width=400",
        instructions:
          "Presenta este cupón en cualquier momento y yo me encargaré de organizar todo. Solo necesitas elegir la fecha perfecta.",
        value: "Una noche inolvidable",
      },
    },
    {
      id: 6,
      title: "Recuerdo Especial",
      description: "La historia de un momento que marcó nuestras vidas",
      type: "memory",
      icon: "💭",
      color: "red",
      isUnlocked: true,
      unlockDate: "Disponible ahora",
      content: {
        title: "Nuestro Primer Beso",
        description: "El momento que selló nuestro destino",
        date: "28 de marzo, 2020",
        location: "Parque Central, bajo las estrellas",
        story: `Era una noche perfecta de primavera. Habíamos estado caminando por el parque después de nuestra tercera cita, hablando de todo y de nada, riendo como si nos conociéramos de toda la vida.

De repente, te detuviste cerca de la fuente iluminada y me miraste con esos ojos que me robaron el aliento desde el primer día. El tiempo se detuvo cuando nuestros labios se encontraron por primera vez.

Fue un beso suave, tierno, lleno de promesas no dichas y sueños compartidos. En ese momento supe que había encontrado a la persona con quien quería pasar el resto de mi vida.

Las estrellas fueron testigos de nuestro primer beso, y desde entonces, cada vez que miro el cielo nocturno, recuerdo ese momento mágico que cambió nuestras vidas para siempre.`,
        images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
        significance:
          "Este momento marcó el inicio oficial de nuestro amor. Fue cuando pasamos de ser dos personas que se gustaban a ser una pareja que se amaba profundamente.",
      },
    },
  ])

  const [selectedSurprise, setSelectedSurprise] = useState<Surprise | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [unlockedSurprises, setUnlockedSurprises] = useState<Set<number>>(new Set())

  // Cargar sorpresas desbloqueadas del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("unlocked-surprises")
    if (saved) {
      setUnlockedSurprises(new Set(JSON.parse(saved)))
    }
  }, [])

  // Guardar sorpresas desbloqueadas en localStorage
  useEffect(() => {
    localStorage.setItem("unlocked-surprises", JSON.stringify([...unlockedSurprises]))
  }, [unlockedSurprises])

  // Actualizar el estado de las sorpresas basado en las desbloqueadas
  useEffect(() => {
    setSurprises((prev) =>
      prev.map((surprise) => ({
        ...surprise,
        isUnlocked: surprise.isUnlocked || unlockedSurprises.has(surprise.id),
      })),
    )
  }, [unlockedSurprises])

  const handleOpenSurprise = (surprise: Surprise) => {
    setSelectedSurprise(surprise)
    setShowModal(true)
  }

  const handleUnlockSurprise = (surprise: Surprise) => {
    // Simular proceso de desbloqueo
    setUnlockedSurprises((prev) => new Set([...prev, surprise.id]))

    // Mostrar la sorpresa después de desbloquear
    setTimeout(() => {
      setSelectedSurprise({ ...surprise, isUnlocked: true })
      setShowModal(true)
    }, 500)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSurprise(null)
  }

  const unlockedCount = surprises.filter((s) => s.isUnlocked).length
  const totalCount = surprises.length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        title="Nuestras Sorpresas"
        description="Pequeños gestos de amor que te harán sonreír y recordar lo especial que eres para mí"
      />

      {/* Stats */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border border-pink-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{unlockedCount}</div>
              <div className="text-sm text-gray-600">Desbloqueadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalCount - unlockedCount}</div>
              <div className="text-sm text-gray-600">Por descubrir</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalCount}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-pink-600">
            <Heart className="w-5 h-5" fill="currentColor" />
            <span className="font-medium">{Math.round((unlockedCount / totalCount) * 100)}% completado</span>
          </div>
        </div>
      </div>

      {/* Surprises grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {surprises.map((surprise, index) => (
          <SurpriseCard
            key={surprise.id}
            surprise={surprise}
            onOpen={() => handleOpenSurprise(surprise)}
            onUnlock={() => handleUnlockSurprise(surprise)}
            index={index}
          />
        ))}
      </div>

      {/* Info section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-pink-100">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">El Poder de las Pequeñas Sorpresas</h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Cada sorpresa en esta sección ha sido creada con amor y cuidado especial para ti. Algunas están disponibles
            inmediatamente, mientras que otras se desbloquearán en fechas especiales o momentos significativos de
            nuestra relación. Cada una representa un pequeño gesto de amor que quiero compartir contigo, porque los
            detalles más pequeños a menudo crean los recuerdos más grandes.
          </p>
        </div>
      </div>

      {/* Surprise modal */}
      <SurpriseModal isOpen={showModal} onClose={closeModal} surprise={selectedSurprise} />
    </div>
  )
}
