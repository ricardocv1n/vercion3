"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Heart, MapPin, Flag, Gift, Star } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Plan } from "./plan-card"

interface PlanFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (plan: Omit<Plan, "id" | "order" | "completed">) => void
  editingPlan: Plan | null
}

export default function PlanForm({ isOpen, onClose, onSave, editingPlan }: PlanFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [category, setCategory] = useState<Plan["category"]>("cita")
  const [priority, setPriority] = useState<Plan["priority"]>("media")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when opening/closing or changing editing plan
  useEffect(() => {
    if (isOpen) {
      if (editingPlan) {
        setTitle(editingPlan.title)
        setDescription(editingPlan.description)
        setDate(new Date(editingPlan.date))
        setCategory(editingPlan.category)
        setPriority(editingPlan.priority)
        setLocation(editingPlan.location || "")
        setNotes(editingPlan.notes || "")
      } else {
        // Default values for new plan
        setTitle("")
        setDescription("")
        setDate(new Date())
        setCategory("cita")
        setPriority("media")
        setLocation("")
        setNotes("")
      }
      setErrors({})
    }
  }, [isOpen, editingPlan])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio"
    } else if (title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres"
    }

    if (!description.trim()) {
      newErrors.description = "La descripción es obligatoria"
    }

    if (!date) {
      newErrors.date = "La fecha es obligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSave({
      title,
      description,
      date: date!.toISOString(),
      category,
      priority,
      location: location || undefined,
      notes: notes || undefined,
    })
  }

  const categoryOptions = [
    { value: "cita", label: "Cita", icon: <CalendarIcon className="h-4 w-4" /> },
    { value: "aniversario", label: "Aniversario", icon: <Heart className="h-4 w-4" /> },
    { value: "vacaciones", label: "Vacaciones", icon: <MapPin className="h-4 w-4" /> },
    { value: "meta", label: "Meta", icon: <Flag className="h-4 w-4" /> },
    { value: "sorpresa", label: "Sorpresa", icon: <Gift className="h-4 w-4" /> },
    { value: "otro", label: "Otro", icon: <Star className="h-4 w-4" /> },
  ]

  const priorityOptions = [
    { value: "alta", label: "Alta", color: "text-red-500" },
    { value: "media", label: "Media", color: "text-orange-500" },
    { value: "baja", label: "Baja", color: "text-cyan-500" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editingPlan ? "Editar Plan" : "Crear Nuevo Plan"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cena romántica"
              className={errors.title ? "border-red-500 focus:ring-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className={errors.description ? "text-red-500" : ""}>
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu plan..."
              className={errors.description ? "border-red-500 focus:ring-red-500" : ""}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date" className={errors.date ? "text-red-500" : ""}>
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      errors.date && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Ubicación (opcional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Restaurante La Vista"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Categoría</Label>
            <RadioGroup
              value={category}
              onValueChange={(value) => setCategory(value as Plan["category"])}
              className="flex flex-wrap gap-2"
            >
              {categoryOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <RadioGroupItem value={option.value} id={`category-${option.value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`category-${option.value}`}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                  >
                    {option.icon}
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Prioridad</Label>
            <RadioGroup
              value={priority}
              onValueChange={(value) => setPriority(value as Plan["priority"])}
              className="flex gap-2"
            >
              {priorityOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <RadioGroupItem value={option.value} id={`priority-${option.value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`priority-${option.value}`}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground ${option.color}`}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cualquier información adicional..."
              className="h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-pink-600 hover:bg-pink-700">
            {editingPlan ? "Actualizar" : "Crear"} Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
