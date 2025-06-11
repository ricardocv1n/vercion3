"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Trash2, Heart, Star, Flag, MapPin, Gift, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export interface Plan {
  id: number
  title: string
  description: string
  date: string
  category: "aniversario" | "vacaciones" | "cita" | "meta" | "sorpresa" | "otro"
  priority: "alta" | "media" | "baja"
  completed: boolean
  order: number
  location?: string
  notes?: string
  image?: string
}

interface PlanCardProps {
  plan: Plan
  onToggleComplete: (id: number) => void
  onEdit: (plan: Plan) => void
  onDelete: (id: number) => void
  isDragging?: boolean
  dragHandleProps?: any
}

export default function PlanCard({
  plan,
  onToggleComplete,
  onEdit,
  onDelete,
  isDragging,
  dragHandleProps,
}: PlanCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getCategoryIcon = () => {
    switch (plan.category) {
      case "aniversario":
        return <Heart className="h-5 w-5 text-pink-500" />
      case "vacaciones":
        return <MapPin className="h-5 w-5 text-blue-500" />
      case "cita":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "meta":
        return <Flag className="h-5 w-5 text-green-500" />
      case "sorpresa":
        return <Gift className="h-5 w-5 text-yellow-500" />
      default:
        return <Star className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategoryLabel = () => {
    switch (plan.category) {
      case "aniversario":
        return "Aniversario"
      case "vacaciones":
        return "Vacaciones"
      case "cita":
        return "Cita"
      case "meta":
        return "Meta"
      case "sorpresa":
        return "Sorpresa"
      default:
        return "Otro"
    }
  }

  const getCategoryColor = () => {
    switch (plan.category) {
      case "aniversario":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "vacaciones":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cita":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "meta":
        return "bg-green-100 text-green-800 border-green-200"
      case "sorpresa":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = () => {
    switch (plan.priority) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200"
      case "media":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
    }
  }

  const getPriorityLabel = () => {
    switch (plan.priority) {
      case "alta":
        return "Alta"
      case "media":
        return "Media"
      default:
        return "Baja"
    }
  }

  const formattedDate = format(new Date(plan.date), "PPP", { locale: es })

  return (
    <Card
      className={`
        transition-all duration-300 hover:shadow-md
        ${plan.completed ? "opacity-75" : ""}
        ${isDragging ? "shadow-lg border-dashed border-2 border-pink-300" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...dragHandleProps}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Checkbox
              checked={plan.completed}
              onCheckedChange={() => onToggleComplete(plan.id)}
              className={`${plan.completed ? "bg-green-500 text-white border-green-500" : ""}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className={`${getCategoryColor()} flex items-center gap-1`}>
                {getCategoryIcon()}
                {getCategoryLabel()}
              </Badge>
              <Badge variant="outline" className={getPriorityColor()}>
                {getPriorityLabel()}
              </Badge>
            </div>

            <h3
              className={`text-lg font-medium mb-1 ${plan.completed ? "line-through text-gray-500" : "text-gray-800"}`}
            >
              {plan.title}
            </h3>

            <p className={`text-sm mb-3 ${plan.completed ? "text-gray-400" : "text-gray-600"}`}>{plan.description}</p>

            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formattedDate}
              {plan.location && (
                <>
                  <span className="mx-2">•</span>
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {plan.location}
                </>
              )}
            </div>

            <div
              className={`
                flex justify-end gap-2 transition-opacity duration-200
                ${isHovered || plan.completed ? "opacity-100" : "opacity-0"}
              `}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => onEdit(plan)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(plan.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Completed sparkles animation */}
        {plan.completed && (
          <div className="absolute top-0 right-0 p-2">
            <Sparkles className="h-5 w-5 text-green-500 animate-pulse" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
