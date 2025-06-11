"use client"

import { useState } from "react"
import PageHeader from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Search, X, Navigation, Eye, Edit, Trash2 } from "lucide-react"
import Timeline from "@/components/timeline"
import GoogleMap from "@/components/google-map"
import FunFacts from "@/components/fun-facts"

interface Milestone {
  id: number
  title: string
  date: string
  description: string
  fullDescription?: string
  image: string
  category: "aniversario" | "viaje" | "hogar" | "evento" | "otro"
}

interface Place {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  type: "visitado" | "planeado" | "evento"
  date: string
  description: string
}

export default function RecuerdosPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      title: "Nuestro primer encuentro",
      date: "15 de marzo de 2020",
      description: "El día que cambió nuestras vidas para siempre",
      fullDescription:
        "Fue en el parque central, un día soleado de primavera. Nunca imaginé que una simple conversación se convertiría en el inicio de la historia más hermosa de mi vida.",
      image: "/placeholder.svg?height=200&width=300",
      category: "aniversario",
    },
    {
      id: 2,
      title: "Nuestro primer viaje juntos",
      date: "20 de junio de 2020",
      description: "Una aventura inolvidable a la playa",
      fullDescription:
        "Tres días mágicos en la costa, donde descubrimos que éramos el equipo perfecto. Cada atardecer, cada paseo por la orilla, cada momento compartido nos unió más.",
      image: "/placeholder.svg?height=200&width=300",
      category: "viaje",
    },
    {
      id: 3,
      title: "Mudanza a nuestro hogar",
      date: "10 de enero de 2021",
      description: "El día que construimos nuestro nido de amor",
      fullDescription:
        "Después de meses buscando, encontramos el lugar perfecto para comenzar nuestra vida juntos. Cada caja que desempacamos era un paso más hacia nuestro futuro compartido.",
      image: "/placeholder.svg?height=200&width=300",
      category: "hogar",
    },
  ])

  const [places, setPlaces] = useState<Place[]>([
    {
      id: 1,
      name: "Parque Central",
      address: "Centro de Montería, Córdoba",
      lat: 8.7479,
      lng: -75.8814,
      type: "visitado",
      date: "15 de marzo de 2020",
      description: "Donde nos conocimos por primera vez",
    },
    {
      id: 2,
      name: "Playa de Coveñas",
      address: "Coveñas, Sucre",
      lat: 9.4089,
      lng: -75.6794,
      type: "visitado",
      date: "20 de junio de 2020",
      description: "Nuestro primer viaje romántico",
    },
  ])

  const [milestoneFilter, setMilestoneFilter] = useState("todos")
  const [placeFilter, setPlaceFilter] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [showPlaceModal, setShowPlaceModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "milestone" | "place"; id: number } | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    date: "",
    description: "",
    fullDescription: "",
    image: "",
    category: "otro" as const,
  })

  const [newPlace, setNewPlace] = useState({
    name: "",
    address: "",
    lat: 0,
    lng: 0,
    type: "visitado" as const,
    date: "",
    description: "",
  })

  const filteredPlaces = places.filter((place) => {
    const matchesFilter = placeFilter === "todos" || place.type === placeFilter
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleAddMilestone = () => {
    if (editingMilestone) {
      setMilestones(
        milestones.map((m) =>
          m.id === editingMilestone.id
            ? {
                ...editingMilestone,
                ...newMilestone,
                image: newMilestone.image || "/placeholder.svg?height=200&width=300",
              }
            : m,
        ),
      )
    } else {
      const milestone: Milestone = {
        id: Date.now(),
        ...newMilestone,
        image: newMilestone.image || "/placeholder.svg?height=200&width=300",
      }
      setMilestones([...milestones, milestone])
    }
    resetMilestoneForm()
  }

  const handleAddPlace = () => {
    if (editingPlace) {
      setPlaces(places.map((p) => (p.id === editingPlace.id ? { ...editingPlace, ...newPlace } : p)))
    } else {
      const place: Place = {
        id: Date.now(),
        ...newPlace,
      }
      setPlaces([...places, place])
    }
    resetPlaceForm()
  }

  const resetMilestoneForm = () => {
    setNewMilestone({
      title: "",
      date: "",
      description: "",
      fullDescription: "",
      image: "",
      category: "otro",
    })
    setEditingMilestone(null)
    setShowMilestoneModal(false)
  }

  const resetPlaceForm = () => {
    setNewPlace({
      name: "",
      address: "",
      lat: 0,
      lng: 0,
      type: "visitado",
      date: "",
      description: "",
    })
    setEditingPlace(null)
    setShowPlaceModal(false)
  }

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setNewMilestone({
      title: milestone.title,
      date: milestone.date,
      description: milestone.description,
      fullDescription: milestone.fullDescription || "",
      image: milestone.image,
      category: milestone.category,
    })
    setShowMilestoneModal(true)
  }

  const handleEditPlace = (place: Place) => {
    setEditingPlace(place)
    setNewPlace({
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      type: place.type,
      date: place.date,
      description: place.description,
    })
    setShowPlaceModal(true)
  }

  const handleDeleteMilestone = (id: number) => {
    setDeleteTarget({ type: "milestone", id })
    setShowDeleteModal(true)
  }

  const handleDeletePlace = (id: number) => {
    setDeleteTarget({ type: "place", id })
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === "milestone") {
        setMilestones(milestones.filter((m) => m.id !== deleteTarget.id))
      } else {
        setPlaces(places.filter((p) => p.id !== deleteTarget.id))
      }
    }
    setDeleteTarget(null)
    setShowDeleteModal(false)
  }

  const handlePlaceSelect = (lat: number, lng: number, address: string, name: string) => {
    setNewPlace((prev) => ({
      ...prev,
      lat,
      lng,
      address,
      name,
    }))
    setShowPlaceModal(true)
  }

  const handlePlaceAction = (action: string, place: Place) => {
    if (action === "route") {
      // Open Google Maps with directions
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
      window.open(url, "_blank")
    } else if (action === "gallery") {
      setSelectedPlace(place)
      setShowGalleryModal(true)
    }
  }

  const milestoneFilters = [
    { key: "todos", label: "Todos" },
    { key: "aniversario", label: "Aniversario" },
    { key: "viaje", label: "Viaje" },
    { key: "hogar", label: "Hogar" },
    { key: "evento", label: "Evento" },
    { key: "otro", label: "Otro" },
  ]

  const placeFilters = [
    { key: "todos", label: "Todos" },
    { key: "visitado", label: "Visitados" },
    { key: "planeado", label: "Planeados" },
    { key: "evento", label: "Eventos" },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        title="Nuestros Recuerdos"
        description="Un compendio visual y emocional de los momentos clave de nuestra historia de amor"
      />

      {/* Fun Facts Section */}
      <div className="mb-12">
        <FunFacts />
      </div>

      {/* Timeline Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-4 md:mb-0">Hitos de Nuestro Amor</h2>
          <div className="flex flex-wrap gap-2">
            {milestoneFilters.map((filter) => (
              <Button
                key={filter.key}
                variant={milestoneFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setMilestoneFilter(filter.key)}
                className={
                  milestoneFilter === filter.key
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-pink-300 text-pink-600 hover:bg-pink-50"
                }
              >
                {filter.label}
              </Button>
            ))}
            <Button onClick={() => setShowMilestoneModal(true)} className="bg-pink-600 hover:bg-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Hito
            </Button>
          </div>
        </div>

        <Timeline
          milestones={milestones}
          onEdit={handleEditMilestone}
          onDelete={handleDeleteMilestone}
          selectedFilter={milestoneFilter}
        />
      </div>

      {/* Map Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-pink-600 mb-6">Mapa de Lugares Especiales</h2>
        <GoogleMap
          places={places}
          onPlaceSelect={handlePlaceSelect}
          onPlaceAction={handlePlaceAction}
          selectedFilter={placeFilter}
        />
      </div>

      {/* Places List Section */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-600 mb-4 md:mb-0">Lista de Lugares Guardados</h2>
          <div className="flex flex-wrap gap-2">
            {placeFilters.map((filter) => (
              <Button
                key={filter.key}
                variant={placeFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setPlaceFilter(filter.key)}
                className={
                  placeFilter === filter.key
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-pink-300 text-pink-600 hover:bg-pink-50"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar lugares..."
              className="pl-10"
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
          <Button onClick={() => setShowPlaceModal(true)} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Añadir Lugar
          </Button>
        </div>

        <div className="grid gap-4 max-h-96 overflow-y-auto">
          {filteredPlaces.map((place) => (
            <Card key={place.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{place.name}</h3>
                    <p className="text-sm text-muted-foreground">{place.date}</p>
                    <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                    <p className="text-xs text-gray-500">{place.address}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ml-4 ${
                      place.type === "visitado"
                        ? "bg-green-100 text-green-800"
                        : place.type === "planeado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {place.type === "visitado" ? "Visitado" : place.type === "planeado" ? "Planeado" : "Evento"}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlaceAction("route", place)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Cómo llegar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlaceAction("gallery", place)}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Galería
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPlace(place)}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePlace(place.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Milestone Modal */}
      <Dialog open={showMilestoneModal} onOpenChange={setShowMilestoneModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingMilestone ? "Editar Hito" : "Añadir Nuevo Hito"}</DialogTitle>
            <DialogDescription>
              {editingMilestone ? "Modifica los detalles del hito" : "Crea un nuevo hito en vuestra historia de amor"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="milestone-title">Título</Label>
              <Input
                id="milestone-title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                placeholder="Ej: Nuestro primer beso"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="milestone-date">Fecha</Label>
              <Input
                id="milestone-date"
                type="date"
                value={newMilestone.date}
                onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="milestone-category">Categoría</Label>
              <select
                id="milestone-category"
                value={newMilestone.category}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, category: e.target.value as Milestone["category"] })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="aniversario">Aniversario</option>
                <option value="viaje">Viaje</option>
                <option value="hogar">Hogar</option>
                <option value="evento">Evento</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="milestone-description">Descripción</Label>
              <Textarea
                id="milestone-description"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                placeholder="Descripción breve del momento..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="milestone-full-description">Descripción completa (opcional)</Label>
              <Textarea
                id="milestone-full-description"
                value={newMilestone.fullDescription}
                onChange={(e) => setNewMilestone({ ...newMilestone, fullDescription: e.target.value })}
                placeholder="Descripción detallada del momento..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="milestone-image">URL de imagen (opcional)</Label>
              <Input
                id="milestone-image"
                value={newMilestone.image}
                onChange={(e) => setNewMilestone({ ...newMilestone, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetMilestoneForm}>
              Cancelar
            </Button>
            <Button onClick={handleAddMilestone} className="bg-pink-600 hover:bg-pink-700">
              {editingMilestone ? "Actualizar" : "Crear"} Hito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Place Modal */}
      <Dialog open={showPlaceModal} onOpenChange={setShowPlaceModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingPlace ? "Editar Lugar" : "Añadir Nuevo Lugar"}</DialogTitle>
            <DialogDescription>
              {editingPlace ? "Modifica los detalles del lugar" : "Añade un nuevo lugar especial a vuestro mapa"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="place-name">Nombre</Label>
              <Input
                id="place-name"
                value={newPlace.name}
                onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                placeholder="Ej: Restaurante La Vista"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="place-address">Dirección</Label>
              <Input
                id="place-address"
                value={newPlace.address}
                onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
                placeholder="Dirección completa"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="place-type">Tipo</Label>
              <select
                id="place-type"
                value={newPlace.type}
                onChange={(e) => setNewPlace({ ...newPlace, type: e.target.value as Place["type"] })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="visitado">Visitado</option>
                <option value="planeado">Planeado</option>
                <option value="evento">Evento</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="place-date">Fecha</Label>
              <Input
                id="place-date"
                type="date"
                value={newPlace.date}
                onChange={(e) => setNewPlace({ ...newPlace, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="place-description">Descripción</Label>
              <Textarea
                id="place-description"
                value={newPlace.description}
                onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                placeholder="Describe qué hace especial este lugar..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetPlaceForm}>
              Cancelar
            </Button>
            <Button onClick={handleAddPlace} className="bg-pink-600 hover:bg-pink-700">
              {editingPlace ? "Actualizar" : "Crear"} Lugar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este {deleteTarget?.type === "milestone" ? "hito" : "lugar"}? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={showGalleryModal} onOpenChange={setShowGalleryModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPlace?.name}</DialogTitle>
            <DialogDescription>{selectedPlace?.address}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">Galería de imágenes del lugar</p>
            </div>
            <p className="text-gray-700">{selectedPlace?.description}</p>
            <p className="text-sm text-gray-500 mt-2">Visitado el: {selectedPlace?.date}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGalleryModal(false)}>
              Cerrar
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700">Compartir ubicación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
