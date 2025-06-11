"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SurpriseAlbumProps {
  content: {
    title: string
    description: string
    photos: Array<{
      id: number
      src: string
      caption: string
      date: string
    }>
  }
}

export default function SurpriseAlbum({ content }: SurpriseAlbumProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const openPhoto = (index: number) => {
    setSelectedPhoto(index)
  }

  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedPhoto === null) return

    if (direction === "prev") {
      setSelectedPhoto(selectedPhoto === 0 ? content.photos.length - 1 : selectedPhoto - 1)
    } else {
      setSelectedPhoto(selectedPhoto === content.photos.length - 1 ? 0 : selectedPhoto + 1)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{content.title}</h3>
        <p className="text-gray-600">{content.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {content.photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
            onClick={() => openPhoto(index)}
          >
            <img
              src={photo.src || "/placeholder.svg?height=200&width=200"}
              alt={photo.caption}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs truncate">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Photo viewer modal */}
      <Dialog open={selectedPhoto !== null} onOpenChange={closePhoto}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedPhoto !== null && (
            <>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={closePhoto}
                >
                  <X className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={() => navigatePhoto("prev")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={() => navigatePhoto("next")}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <img
                  src={content.photos[selectedPhoto].src || "/placeholder.svg"}
                  alt={content.photos[selectedPhoto].caption}
                  className="w-full max-h-[70vh] object-contain bg-black"
                />
              </div>

              <div className="p-4 bg-white">
                <h4 className="font-medium text-gray-800">{content.photos[selectedPhoto].caption}</h4>
                <p className="text-sm text-gray-500">{content.photos[selectedPhoto].date}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
