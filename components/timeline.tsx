"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"

interface Milestone {
  id: number
  title: string
  date: string
  description: string
  fullDescription?: string
  image: string
  category: "aniversario" | "viaje" | "hogar" | "evento" | "otro"
}

interface TimelineProps {
  milestones: Milestone[]
  onEdit: (milestone: Milestone) => void
  onDelete: (id: number) => void
  selectedFilter: string
}

export default function Timeline({ milestones, onEdit, onDelete, selectedFilter }: TimelineProps) {
  const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set())
  const [visibleMilestones, setVisibleMilestones] = useState<Set<number>>(new Set())

  const filteredMilestones = milestones.filter(
    (milestone) => selectedFilter === "todos" || milestone.category === selectedFilter,
  )

  useEffect(() => {
    // Animate milestones appearing
    const timer = setTimeout(() => {
      filteredMilestones.forEach((_, index) => {
        setTimeout(() => {
          setVisibleMilestones((prev) => new Set([...prev, index]))
        }, index * 200)
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [filteredMilestones])

  const toggleExpanded = (id: number) => {
    setExpandedMilestones((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "aniversario":
        return "bg-pink-100 text-pink-800"
      case "viaje":
        return "bg-blue-100 text-blue-800"
      case "hogar":
        return "bg-green-100 text-green-800"
      case "evento":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "aniversario":
        return "Aniversario"
      case "viaje":
        return "Viaje"
      case "hogar":
        return "Hogar"
      case "evento":
        return "Evento"
      default:
        return "Otro"
    }
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-pink-200 h-full"></div>

      <div className="space-y-12">
        {filteredMilestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`relative transition-all duration-700 ${
              visibleMilestones.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Milestone marker */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>

            {/* Milestone content */}
            <div className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <Card
                className={`w-full max-w-md shadow-lg ${
                  index % 2 === 0 ? "mr-8" : "ml-8"
                } hover:shadow-xl transition-shadow duration-300`}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={milestone.image || "/placeholder.svg?height=200&width=300"}
                      alt={milestone.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-pink-600">{milestone.title}</h3>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-pink-600"
                          onClick={() => onEdit(milestone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => onDelete(milestone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{milestone.date}</p>
                    <p className="text-gray-700 mb-3">{milestone.description}</p>

                    {milestone.fullDescription && (
                      <div>
                        {expandedMilestones.has(milestone.id) && (
                          <p className="text-gray-600 text-sm mb-3">{milestone.fullDescription}</p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(milestone.id)}
                          className="text-pink-600 hover:text-pink-700 p-0 h-auto"
                        >
                          {expandedMilestones.has(milestone.id) ? (
                            <>
                              Ver menos <ChevronUp className="h-4 w-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Ver más <ChevronDown className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    <div className="mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(milestone.category)}`}>
                        {getCategoryLabel(milestone.category)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
