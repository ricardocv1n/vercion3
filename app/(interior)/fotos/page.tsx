"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Upload, Grid, List } from "lucide-react"
import PhotoHeader from "@/components/photo-header"
import MediaCard from "@/components/media-card"
import MediaViewer from "@/components/media-viewer"
import RomanticMessage from "@/components/romantic-message"

interface MediaItem {
  id: number
  title: string
  date: string
  description: string
  src: string
  thumbnail?: string
  type: "photo" | "video"
  category: "momentos" | "viajes" | "celebraciones" | "aventuras" | "cotidiano"
  likes: number
  aspectRatio?: "square" | "portrait" | "landscape"
}

export default function FotosPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 1,
      title: "Nuestro primer aniversario",
      date: "2021-03-15",
      description:
        "Una cena romántica para celebrar nuestro primer año juntos. Fue una noche mágica llena de amor, risas y promesas para el futuro.",
      src: "/placeholder.svg?height=400&width=400",
      type: "photo",
      category: "celebraciones",
      likes: 0,
      aspectRatio: "square",
    },
    {
      id: 2,
      title: "Atardecer en la playa",
      date: "2021-06-20",
      description:
        "Caminando por la orilla del mar al atardecer, tomados de la mano y soñando con nuestro futuro juntos.",
      src: "/placeholder.svg?height=600&width=400",
      type: "photo",
      category: "viajes",
      likes: 0,
      aspectRatio: "portrait",
    },
    {
      id: 3,
      title: "Cocinando juntos",
      date: "2021-08-10",
      description:
        "Una tarde divertida preparando nuestra receta favorita. Entre risas y pequeños desastres culinarios, creamos recuerdos hermosos.",
      src: "/placeholder.svg?height=400&width=600",
      type: "video",
      category: "cotidiano",
      likes: 0,
      aspectRatio: "landscape",
    },
    {
      id: 4,
      title: "Senderismo en las montañas",
      date: "2021-09-05",
      description:
        "Una aventura increíble explorando senderos montañosos. La vista desde la cima valió cada paso del camino.",
      src: "/placeholder.svg?height=600&width=400",
      type: "photo",
      category: "aventuras",
      likes: 0,
      aspectRatio: "portrait",
    },
    {
      id: 5,
      title: "Momento espontáneo",
      date: "2021-11-12",
      description: "Uno de esos momentos perfectos que suceden sin planificar. Tu sonrisa iluminó todo mi día.",
      src: "/placeholder.svg?height=400&width=400",
      type: "photo",
      category: "momentos",
      likes: 0,
      aspectRatio: "square",
    },
    {
      id: 6,
      title: "Celebrando tu cumpleaños",
      date: "2022-02-14",
      description:
        "El día más especial del año, celebrando a la persona más importante de mi vida con una sorpresa que preparé con todo mi amor.",
      src: "/placeholder.svg?height=400&width=600",
      type: "video",
      category: "celebraciones",
      likes: 0,
      aspectRatio: "landscape",
    },
    {
      id: 7,
      title: "Nuestro picnic en el parque",
      date: "2022-04-18",
      description: "Una tarde perfecta con comida deliciosa, risas y el mejor compañero que podría desear.",
      src: "/placeholder.svg?height=400&width=400",
      type: "photo",
      category: "cotidiano",
      likes: 0,
      aspectRatio: "square",
    },
    {
      id: 8,
      title: "Explorando la ciudad",
      date: "2022-05-22",
      description: "Descubriendo rincones mágicos en nuestra propia ciudad. Cada calle tiene una historia que contar.",
      src: "/placeholder.svg?height=600&width=400",
      type: "photo",
      category: "aventuras",
      likes: 0,
      aspectRatio: "portrait",
    },
    {
      id: 9,
      title: "Nuestro baile bajo las estrellas",
      date: "2022-07-30",
      description: "Esa noche mágica donde bailamos sin música, solo guiados por el ritmo de nuestros corazones.",
      src: "/placeholder.svg?height=400&width=600",
      type: "video",
      category: "momentos",
      likes: 0,
      aspectRatio: "landscape",
    },
    {
      id: 10,
      title: "Viaje sorpresa",
      date: "2022-09-10",
      description: "El viaje que planeé durante meses para sorprenderte. Tu cara de felicidad lo valió todo.",
      src: "/placeholder.svg?height=600&width=400",
      type: "photo",
      category: "viajes",
      likes: 0,
      aspectRatio: "portrait",
    },
    {
      id: 11,
      title: "Nuestra primera mascota",
      date: "2022-11-05",
      description: "El día que nuestra familia creció con un nuevo miembro peludo. Amor instantáneo.",
      src: "/placeholder.svg?height=400&width=400",
      type: "photo",
      category: "momentos",
      likes: 0,
      aspectRatio: "square",
    },
    {
      id: 12,
      title: "Navidad en familia",
      date: "2022-12-25",
      description: "La celebración más cálida y amorosa, rodeados de las personas que más queremos.",
      src: "/placeholder.svg?height=400&width=600",
      type: "video",
      category: "celebraciones",
      likes: 0,
      aspectRatio: "landscape",
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState("todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())
  const [romanticMessage, setRomanticMessage] = useState("")
  const [showRomanticMessage, setShowRomanticMessage] = useState(false)

  const categories = [
    { key: "todas", label: "Todas", emoji: "📷", count: mediaItems.length },
    {
      key: "momentos",
      label: "Momentos Especiales",
      emoji: "💕",
      count: mediaItems.filter((item) => item.category === "momentos").length,
    },
    {
      key: "viajes",
      label: "Viajes",
      emoji: "✈️",
      count: mediaItems.filter((item) => item.category === "viajes").length,
    },
    {
      key: "celebraciones",
      label: "Celebraciones",
      emoji: "🎉",
      count: mediaItems.filter((item) => item.category === "celebraciones").length,
    },
    {
      key: "aventuras",
      label: "Aventuras",
      emoji: "🏔️",
      count: mediaItems.filter((item) => item.category === "aventuras").length,
    },
    {
      key: "cotidiano",
      label: "Cotidiano",
      emoji: "🏠",
      count: mediaItems.filter((item) => item.category === "cotidiano").length,
    },
  ]

  // Load likes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem("photo-likes")
    if (savedLikes) {
      setLikedItems(new Set(JSON.parse(savedLikes)))
    }
  }, [])

  // Save likes to localStorage
  useEffect(() => {
    localStorage.setItem("photo-likes", JSON.stringify([...likedItems]))
  }, [likedItems])

  // Update media items with current likes
  useEffect(() => {
    setMediaItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        likes: likedItems.has(item.id) ? Math.max(1, item.likes) : Math.max(0, item.likes),
      })),
    )
  }, [likedItems])

  const filteredItems = mediaItems.filter((item) => {
    const matchesCategory = selectedCategory === "todas" || item.category === selectedCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const totalPhotos = mediaItems.filter((item) => item.type === "photo").length
  const totalVideos = mediaItems.filter((item) => item.type === "video").length

  const handleOpenViewer = (item: MediaItem) => {
    setSelectedItem(item)
    setShowViewer(true)
  }

  const handleLike = (itemId: number) => {
    setLikedItems((prev) => {
      const newLikes = new Set(prev)
      if (newLikes.has(itemId)) {
        newLikes.delete(itemId)
      } else {
        newLikes.add(itemId)
        // Show romantic message when liking
        const messages = [
          "¡Me encanta que te guste este recuerdo! 💕",
          "Este momento también es especial para mí ✨",
          "Qué hermoso que compartamos los mismos recuerdos favoritos 🥰",
          "Tu corazón y el mío laten al mismo ritmo 💖",
        ]
        setRomanticMessage(messages[Math.floor(Math.random() * messages.length)])
        setShowRomanticMessage(true)
      }
      return newLikes
    })
  }

  const handleNavigateViewer = (direction: "prev" | "next") => {
    if (!selectedItem) return

    const currentIndex = filteredItems.findIndex((item) => item.id === selectedItem.id)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedItem(filteredItems[newIndex])
  }

  const getNavigationState = () => {
    if (!selectedItem) return { prev: false, next: false }

    const currentIndex = filteredItems.findIndex((item) => item.id === selectedItem.id)
    return {
      prev: filteredItems.length > 1,
      next: filteredItems.length > 1,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Background texture */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ec4899' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Custom Header */}
        <PhotoHeader
          coupleImage="/placeholder.svg?height=128&width=128"
          relationshipStart="2020-03-15"
          totalPhotos={totalPhotos}
          totalVideos={totalVideos}
        />

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border border-pink-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en nuestros recuerdos..."
                className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-pink-300 text-pink-600 hover:bg-pink-50"
                }
              >
                <Grid className="h-4 w-4 mr-2" />
                Cuadrícula
              </Button>
              <Button
                variant={viewMode === "masonry" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("masonry")}
                className={
                  viewMode === "masonry"
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-pink-300 text-pink-600 hover:bg-pink-50"
                }
              >
                <List className="h-4 w-4 mr-2" />
                Pinterest
              </Button>
            </div>

            {/* Upload Button */}
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Upload className="h-4 w-4 mr-2" />
              Subir Recuerdo
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border border-pink-100">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className={`
                  transition-all duration-200 hover:scale-105
                  ${
                    selectedCategory === category.key
                      ? "bg-pink-600 hover:bg-pink-700 shadow-lg"
                      : "border-pink-300 text-pink-600 hover:bg-pink-50 hover:shadow-md"
                  }
                `}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.label}
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        {filteredItems.length > 0 ? (
          viewMode === "masonry" ? (
            <div className="masonry-grid">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="masonry-item animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MediaCard
                    item={item}
                    onOpen={() => handleOpenViewer(item)}
                    onLike={() => handleLike(item.id)}
                    isLiked={likedItems.has(item.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <MediaCard
                    item={item}
                    onOpen={() => handleOpenViewer(item)}
                    onLike={() => handleLike(item.id)}
                    isLiked={likedItems.has(item.id)}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery || selectedCategory !== "todas" ? "No se encontraron recuerdos" : "Aún no hay recuerdos"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory !== "todas"
                ? "Intenta cambiar los filtros de búsqueda"
                : "Comienza subiendo vuestras primeras fotos y videos"}
            </p>
            {!searchQuery && selectedCategory === "todas" && (
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Upload className="h-4 w-4 mr-2" />
                Subir Primer Recuerdo
              </Button>
            )}
          </div>
        )}

        {/* Media Viewer */}
        <MediaViewer
          isOpen={showViewer}
          onClose={() => setShowViewer(false)}
          item={selectedItem}
          onLike={() => selectedItem && handleLike(selectedItem.id)}
          isLiked={selectedItem ? likedItems.has(selectedItem.id) : false}
          onNavigate={handleNavigateViewer}
          canNavigate={getNavigationState()}
        />

        {/* Romantic Message */}
        <RomanticMessage
          message={romanticMessage}
          isVisible={showRomanticMessage}
          onClose={() => setShowRomanticMessage(false)}
        />
      </div>
    </div>
  )
}
