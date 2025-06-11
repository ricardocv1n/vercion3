"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

interface CarouselItem {
  id: number
  image: string
  title: string
  description: string
}

interface EnhancedCarouselProps {
  items: CarouselItem[]
  autoPlayInterval?: number
}

export default function EnhancedCarousel({ items, autoPlayInterval = 5000 }: EnhancedCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const autoPlayTimeout = useRef<NodeJS.Timeout | null>(null)

  const startProgressBar = () => {
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    // Reset progress
    setProgress(0)

    // Start new progress interval
    const intervalTime = 50 // Update every 50ms for smooth animation
    const steps = autoPlayInterval / intervalTime
    const increment = 100 / steps

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + increment
      })
    }, intervalTime)
  }

  const startAutoPlay = () => {
    if (autoPlayTimeout.current) {
      clearTimeout(autoPlayTimeout.current)
    }

    autoPlayTimeout.current = setTimeout(() => {
      nextSlide()
    }, autoPlayInterval)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (isPlaying) {
      startProgressBar()
      startAutoPlay()
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      if (autoPlayTimeout.current) {
        clearTimeout(autoPlayTimeout.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      if (autoPlayTimeout.current) {
        clearTimeout(autoPlayTimeout.current)
      }
    }
  }, [isPlaying, currentSlide])

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg">
      {/* Main carousel */}
      <div className="relative aspect-video">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="min-w-full h-full">
              <div className="relative h-full">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={currentSlide === item.id - 1}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
          <div
            className="h-full bg-pink-600 transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
          onClick={() => {
            prevSlide()
            if (isPlaying) {
              startProgressBar()
              startAutoPlay()
            }
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
          onClick={() => {
            nextSlide()
            if (isPlaying) {
              startProgressBar()
              startAutoPlay()
            }
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Play/Pause button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-2 gap-2 p-2 bg-white/80 rounded-b-xl">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
              currentSlide === index ? "border-pink-600 scale-110" : "border-transparent opacity-70"
            }`}
            onClick={() => {
              goToSlide(index)
              if (isPlaying) {
                startProgressBar()
                startAutoPlay()
              }
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={`Miniatura ${item.title}`}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
