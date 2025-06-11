"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns"
import { es } from "date-fns/locale"
import type { Plan } from "./plan-card"

interface PlanCalendarProps {
  plans: Plan[]
  onSelectPlan: (plan: Plan) => void
}

export default function PlanCalendar({ plans, onSelectPlan }: PlanCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  // Get day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startDay = startOfMonth(currentMonth).getDay()

  // Adjust for Monday as first day of week
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1

  // Get plans for the current month
  const plansInMonth = plans.filter((plan) => {
    const planDate = new Date(plan.date)
    return isSameMonth(planDate, currentMonth)
  })

  // Group plans by date
  const plansByDate = plansInMonth.reduce(
    (acc, plan) => {
      const dateStr = format(new Date(plan.date), "yyyy-MM-dd")
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(plan)
      return acc
    },
    {} as Record<string, Plan[]>,
  )

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const dateStr = format(date, "yyyy-MM-dd")
    const plansForDate = plansByDate[dateStr] || []

    if (plansForDate.length === 1) {
      onSelectPlan(plansForDate[0])
    } else if (plansForDate.length > 1) {
      // If multiple plans, we could show a list or select the first one
      onSelectPlan(plansForDate[0])
    }
  }

  const getCategoryColor = (category: Plan["category"]) => {
    switch (category) {
      case "aniversario":
        return "bg-pink-500"
      case "vacaciones":
        return "bg-blue-500"
      case "cita":
        return "bg-purple-500"
      case "meta":
        return "bg-green-500"
      case "sorpresa":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-pink-500" />
          Calendario de Planes
        </CardTitle>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium">{format(currentMonth, "MMMM yyyy", { locale: es })}</span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent ref={calendarRef}>
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the start of the month */}
          {Array.from({ length: adjustedStartDay }).map((_, i) => (
            <div key={`empty-start-${i}`} className="aspect-square p-1" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd")
            const plansForDay = plansByDate[dateStr] || []
            const hasPlans = plansForDay.length > 0
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={dateStr}
                className={`aspect-square p-1 relative ${hasPlans ? "cursor-pointer" : ""}`}
                onClick={hasPlans ? () => handleDateClick(day) : undefined}
              >
                <div
                  className={`w-full h-full flex flex-col items-center justify-start rounded-full p-1 ${
                    isSelected ? "bg-pink-100 text-pink-800" : hasPlans ? "hover:bg-gray-100" : ""
                  }`}
                >
                  <span className={`text-sm ${hasPlans ? "font-medium" : ""}`}>{format(day, "d")}</span>

                  {/* Plan indicators */}
                  {hasPlans && (
                    <div className="flex gap-0.5 mt-1">
                      {plansForDay.slice(0, 3).map((plan) => (
                        <div
                          key={plan.id}
                          className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(plan.category)}`}
                          title={plan.title}
                        />
                      ))}
                      {plansForDay.length > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title="Más planes" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
