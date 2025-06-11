"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Calendar } from "lucide-react"
import FloatingHearts from "@/components/floating-hearts"

export default function LoginPage() {
  const router = useRouter()
  const [date, setDate] = useState("")
  const [isDateValid, setIsDateValid] = useState(false)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
    setIsDateValid(e.target.validity.valid && e.target.value !== "")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isDateValid) {
      // Store the anniversary date in localStorage
      localStorage.setItem("anniversaryDate", date)
      router.push("/inicio")
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Settings button in top right */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-full z-10"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Floating hearts background */}
      <FloatingHearts />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full flex flex-col items-center">
          {/* Main title */}
          <h1 className="text-5xl md:text-6xl font-bold text-pink-600 mb-8 text-center">¡Bienvenida Amor!</h1>

          {/* Subtitle */}
          <p className="text-center text-gray-700 mb-2">Ingresa nuestra fecha de aniversario para continuar.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            <div className="space-y-2">
              <label htmlFor="anniversary" className="text-center block text-gray-700 font-medium">
                Fecha de Aniversario:
              </label>
              <div className="relative">
                <Input
                  id="anniversary"
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className="rounded-full border-2 border-pink-300 focus:border-pink-500 focus:ring-pink-500 pr-12 text-center"
                  placeholder="dd/mm/aaaa"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2"
                disabled={!isDateValid}
              >
                Ingresar
                <span className="text-lg">→</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
