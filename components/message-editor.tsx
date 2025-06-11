"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Save } from "lucide-react"

interface Message {
  id: number
  title: string
  content: string
  date: string
  category: "amor" | "motivacion" | "recuerdo" | "futuro" | "especial"
  isRead: boolean
}

interface MessageEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (message: Omit<Message, "id" | "isRead">) => void
  editingMessage?: Message | null
}

export default function MessageEditor({ isOpen, onClose, onSave, editingMessage }: MessageEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    category: "amor" as const,
  })

  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (editingMessage) {
      setFormData({
        title: editingMessage.title,
        content: editingMessage.content,
        date: editingMessage.date,
        category: editingMessage.category,
      })
    } else {
      setFormData({
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        category: "amor",
      })
    }
  }, [editingMessage, isOpen])

  useEffect(() => {
    setCharCount(formData.content.length)
  }, [formData.content])

  const handleSave = () => {
    if (formData.title.trim() && formData.content.trim()) {
      onSave(formData)
      onClose()
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      category: "amor",
    })
    onClose()
  }

  const categories = [
    { value: "amor", label: "Mensaje de Amor", emoji: "💕" },
    { value: "motivacion", label: "Motivación", emoji: "⭐" },
    { value: "recuerdo", label: "Recuerdo Especial", emoji: "📸" },
    { value: "futuro", label: "Planes Futuros", emoji: "🌟" },
    { value: "especial", label: "Momento Especial", emoji: "✨" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-pink-600">
            <Heart className="h-5 w-5" />
            {editingMessage ? "Editar Mensaje" : "Escribir Nuevo Mensaje"}
          </DialogTitle>
          <DialogDescription>
            {editingMessage ? "Modifica tu mensaje especial" : "Crea un nuevo mensaje lleno de amor y cariño"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">
              Título del mensaje
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Para mi amor en nuestro aniversario"
              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category" className="text-gray-700 font-medium">
              Categoría
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="flex h-10 w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm ring-offset-background focus:border-pink-400 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date" className="text-gray-700 font-medium">
              Fecha
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content" className="text-gray-700 font-medium">
                Contenido del mensaje
              </Label>
              <span className={`text-xs ${charCount > 1000 ? "text-red-500" : "text-gray-500"}`}>
                {charCount}/1000 caracteres
              </span>
            </div>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Escribe aquí tu mensaje especial... Cada palabra que escribas será un tesoro guardado en nuestro corazón."
              className="min-h-[200px] border-pink-200 focus:border-pink-400 focus:ring-pink-400 font-serif"
              style={{ fontFamily: "'Dancing Script', cursive, serif" }}
              maxLength={1000}
            />
          </div>

          {/* Preview */}
          {formData.content && (
            <div className="border border-pink-200 rounded-lg p-4 bg-gradient-to-br from-pink-50 to-rose-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
              <div className="text-gray-600 font-serif italic">
                "{formData.content.substring(0, 150)}
                {formData.content.length > 150 ? "..." : ""}"
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-pink-600 hover:bg-pink-700"
            disabled={!formData.title.trim() || !formData.content.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            {editingMessage ? "Actualizar" : "Guardar"} Mensaje
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
