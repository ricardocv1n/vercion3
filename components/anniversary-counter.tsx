"use client"

import { useState, useEffect } from "react"
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  addYears,
} from "date-fns"

interface TimeCounter {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface AnniversaryCounterProps {
  anniversaryDate: Date
}

export default function AnniversaryCounter({ anniversaryDate }: AnniversaryCounterProps) {
  const [counter, setCounter] = useState<TimeCounter>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [daysToAnniversary, setDaysToAnniversary] = useState(0)

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date()

      // Calculate time difference
      const years = differenceInYears(now, anniversaryDate)
      const months = differenceInMonths(now, anniversaryDate) % 12
      const days = differenceInDays(now, anniversaryDate) % 30
      const hours = differenceInHours(now, anniversaryDate) % 24
      const minutes = differenceInMinutes(now, anniversaryDate) % 60
      const seconds = differenceInSeconds(now, anniversaryDate) % 60

      setCounter({ years, months, days, hours, minutes, seconds })

      // Calculate days until next anniversary
      const nextAnniversary = addYears(anniversaryDate, years + 1)
      const daysLeft = differenceInDays(nextAnniversary, now)
      setDaysToAnniversary(daysLeft)
    }

    // Update immediately
    updateCounter()

    // Then update every second
    const interval = setInterval(updateCounter, 1000)
    return () => clearInterval(interval)
  }, [anniversaryDate])

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-2 md:gap-4 text-center">
        <div className="bg-white rounded-lg p-2 md:p-4 shadow-md">
          <p className="text-2xl md:text-4xl font-bold text-pink-600">{counter.years}</p>
          <p className="text-xs md:text-sm uppercase text-pink-600">AÑOS</p>
        </div>
        <div className="bg-white rounded-lg p-2 md:p-4 shadow-md">
          <p className="text-2xl md:text-4xl font-bold text-pink-600">{counter.months}</p>
          <p className="text-xs md:text-sm uppercase text-pink-600">MESES</p>
        </div>
        <div className="bg-white rounded-lg p-2 md:p-4 shadow-md">
          <p className="text-2xl md:text-4xl font-bold text-pink-600">{counter.days}</p>
          <p className="text-xs md:text-sm uppercase text-pink-600">DÍAS</p>
        </div>
        <div className="bg-white rounded-lg p-2 md:p-4 shadow-md">
          <p className="text-2xl md:text-4xl font-bold text-pink-600">{counter.hours}</p>
          <p className="text-xs md:text-sm uppercase text-pink-600">HORAS</p>
        </div>
        <div className="bg-white rounded-lg p-2 md:p-4 shadow-md">
          <p className="text-2xl md:text-4xl font-bold text-pink-600">{counter.minutes}</p>
          <p className="text-xs md:text-sm uppercase text-pink-600">MIN</p>
        </div>
        <div className="bg-white rounded-lg p-2 md:p-4 shadow-md">
          <p className="text-2xl md:text-4xl font-bold text-pink-600">{counter.seconds}</p>
          <p className="text-xs md:text-sm uppercase text-pink-600">SEG</p>
        </div>
      </div>
      <p className="text-center mt-4 bg-white px-4 py-2 rounded-full shadow-md inline-block mx-auto">
        Faltan <span className="font-bold text-pink-600">{daysToAnniversary}</span> días para nuestro próximo
        aniversario ❤️
      </p>
    </div>
  )
}
