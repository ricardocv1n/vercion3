"use client"

import { useState, useEffect, useRef } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1Icon as RepeatOne,
  Volume2,
  Volume1,
  VolumeX,
  Rewind,
  FastForward,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import WaveVisualizer from "./wave-visualizer"
import MusicPlaylist from "./music-playlist"
import SongDescription from "./song-description"

export interface Song {
  id: number
  title: string
  artist: string
  src: string
  cover?: string
  description?: string
  color?: string
  dedicatoria?: string
}

interface MusicPlayerProps {
  initialSongs: Song[]
}

export default function MusicPlayer({ initialSongs }: MusicPlayerProps) {
  // Estado del reproductor
  const [songs, setSongs] = useState<Song[]>(initialSongs)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(80)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"none" | "all" | "one">("none")
  const [isHeartBeating, setIsHeartBeating] = useState(false)
  const [audioData, setAudioData] = useState<number[]>([])
  const [showDescription, setShowDescription] = useState(false)

  // Referencias
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  const currentSong = songs[currentSongIndex]

  // Inicializar el reproductor
  useEffect(() => {
    // Cargar el estado guardado
    const loadSavedState = () => {
      const savedState = localStorage.getItem("music-player-state")
      if (savedState) {
        try {
          const state = JSON.parse(savedState)
          setCurrentSongIndex(state.currentSongIndex || 0)
          setVolume(state.volume !== undefined ? state.volume : 80)
          setIsMuted(state.isMuted || false)
          setIsShuffle(state.isShuffle || false)
          setRepeatMode(state.repeatMode || "none")

          // Si había una canción reproduciéndose, establecer el tiempo
          if (audioRef.current && state.currentTime) {
            audioRef.current.currentTime = state.currentTime
          }
        } catch (error) {
          console.error("Error loading saved state:", error)
        }
      }
    }

    loadSavedState()

    // Configurar el contexto de audio para el visualizador
    const setupAudioContext = () => {
      if (!audioRef.current) return

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)

      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(audioContextRef.current.destination)

      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const updateVisualizer = () => {
        if (!analyserRef.current) return

        analyserRef.current.getByteFrequencyData(dataArray)
        setAudioData(Array.from(dataArray))

        // Actualizar el latido del corazón basado en la intensidad del audio
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
        setIsHeartBeating(average > 70) // Umbral para activar el latido

        animationRef.current = requestAnimationFrame(updateVisualizer)
      }

      updateVisualizer()
    }

    if (audioRef.current) {
      setupAudioContext()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (sourceRef.current) {
        sourceRef.current.disconnect()
      }

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Guardar el estado del reproductor
  useEffect(() => {
    const saveState = () => {
      const state = {
        currentSongIndex,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        currentTime: audioRef.current?.currentTime || 0,
      }
      localStorage.setItem("music-player-state", JSON.stringify(state))
    }

    saveState()
  }, [currentSongIndex, volume, isMuted, isShuffle, repeatMode])

  // Actualizar la duración cuando cambia la canción
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateDuration = () => {
      const minutes = Math.floor(audio.duration / 60)
      const seconds = Math.floor(audio.duration % 60)
      setDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0
        audio.play()
      } else if (repeatMode === "all" || isShuffle) {
        playNextSong()
      } else if (currentSongIndex < songs.length - 1) {
        playNextSong()
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSongIndex, repeatMode, isShuffle, songs.length])

  // Actualizar el progreso de la canción
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100
      setProgress(isNaN(currentProgress) ? 0 : currentProgress)

      const minutes = Math.floor(audio.currentTime / 60)
      const seconds = Math.floor(audio.currentTime % 60)
      setCurrentTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)

      animationRef.current = requestAnimationFrame(updateProgress)
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  // Controlar la reproducción
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, currentSongIndex])

  // Controlar el volumen
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  // Funciones de control
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const playPreviousSong = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      setCurrentSongIndex(randomIndex)
    } else {
      setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
    }
    setIsPlaying(true)
  }

  const playNextSong = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length)
      setCurrentSongIndex(randomIndex)
    } else {
      setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
    }
    setIsPlaying(true)
  }

  const handleProgressChange = (values: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newProgress = values[0]
    const newTime = (newProgress / 100) * audio.duration
    audio.currentTime = newTime
    setProgress(newProgress)
  }

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      setVolume(previousVolume)
    } else {
      setPreviousVolume(volume)
      setIsMuted(true)
    }
  }

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle)
  }

  const toggleRepeat = () => {
    if (repeatMode === "none") {
      setRepeatMode("all")
    } else if (repeatMode === "all") {
      setRepeatMode("one")
    } else {
      setRepeatMode("none")
    }
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - 10)
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10)
  }

  const playSpecificSong = (index: number) => {
    setCurrentSongIndex(index)
    setIsPlaying(true)
  }

  const toggleDescription = () => {
    setShowDescription(!showDescription)
  }

  // Obtener el icono de volumen según el estado
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />
    if (volume < 50) return <Volume1 />
    return <Volume2 />
  }

  // Obtener el color de fondo según la canción actual
  const getBackgroundStyle = () => {
    const defaultColor = "from-pink-500 to-purple-600"
    const songColor = currentSong?.color || defaultColor
    return `bg-gradient-to-br ${songColor}`
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-pink-100">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sección izquierda: Portada y visualizador */}
          <div className="w-full lg:w-1/3 flex flex-col">
            {/* Portada del álbum con visualizador */}
            <div
              className={`relative aspect-square rounded-xl overflow-hidden shadow-lg mb-4 ${getBackgroundStyle()}`}
              onClick={togglePlayPause}
            >
              {currentSong.cover ? (
                <img
                  src={currentSong.cover || "/placeholder.svg"}
                  alt={`${currentSong.title} cover`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className={`text-white/80 w-24 h-24 ${isHeartBeating ? "animate-pulse" : ""}`} fill="white" />
                </div>
              )}

              {/* Overlay de reproducción */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="bg-white/20 backdrop-blur-md p-6 rounded-full">
                  {isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 text-white ml-1" />
                  )}
                </div>
              </div>

              {/* Visualizador de ondas */}
              <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center">
                <WaveVisualizer audioData={audioData} isPlaying={isPlaying} />
              </div>
            </div>

            {/* Información de la canción */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 truncate">{currentSong.title}</h3>
              <p className="text-gray-600">{currentSong.artist}</p>
            </div>

            {/* Botón de descripción */}
            <Button
              variant="outline"
              className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
              onClick={toggleDescription}
            >
              {showDescription ? "Ocultar dedicatoria" : "Ver dedicatoria"}
            </Button>
          </div>

          {/* Sección derecha: Controles y playlist */}
          <div className="flex-1 flex flex-col">
            {/* Controles de reproducción y progreso */}
            <div className="mb-6">
              {/* Barra de progreso */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 w-10 text-right">{currentTime}</span>
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  className="flex-1"
                  onValueChange={handleProgressChange}
                />
                <span className="text-xs text-gray-500 w-10">{duration}</span>
              </div>

              {/* Controles principales */}
              <div className="flex justify-center items-center gap-2 md:gap-4 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-gray-600 hover:text-pink-600 ${isShuffle ? "text-pink-600 bg-pink-50" : ""}`}
                  onClick={toggleShuffle}
                >
                  <Shuffle className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-pink-600"
                  onClick={skipBackward}
                >
                  <Rewind className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-pink-600"
                  onClick={playPreviousSong}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="default"
                  size="icon"
                  className="bg-pink-600 hover:bg-pink-700 rounded-full h-14 w-14 flex items-center justify-center"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-7 w-7 text-white" /> : <Play className="h-7 w-7 text-white ml-1" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-pink-600"
                  onClick={playNextSong}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-pink-600" onClick={skipForward}>
                  <FastForward className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`text-gray-600 hover:text-pink-600 ${repeatMode !== "none" ? "text-pink-600 bg-pink-50" : ""}`}
                  onClick={toggleRepeat}
                >
                  {repeatMode === "one" ? <RepeatOne className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
                </Button>
              </div>

              {/* Control de volumen */}
              <div className="flex items-center gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-pink-600 h-8 w-8"
                  onClick={toggleMute}
                >
                  {getVolumeIcon()}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  className="w-32"
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>

            {/* Lista de reproducción */}
            <div className="flex-1 overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nuestra Playlist</h3>
              <MusicPlaylist
                songs={songs}
                currentSongIndex={currentSongIndex}
                isPlaying={isPlaying}
                onSelectSong={playSpecificSong}
              />
            </div>
          </div>
        </div>

        {/* Descripción de la canción */}
        {showDescription && currentSong.dedicatoria && (
          <SongDescription
            title={currentSong.title}
            artist={currentSong.artist}
            description={currentSong.dedicatoria}
            color={currentSong.color}
          />
        )}
      </div>

      {/* Audio element (hidden) */}
      <audio ref={audioRef} src={currentSong.src} preload="metadata" />
    </div>
  )
}
