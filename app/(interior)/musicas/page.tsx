"use client"

import { useState } from "react"
import PageHeader from "@/components/page-header"
import MusicPlayer from "@/components/music-player"
import type { Song } from "@/components/music-player"

export default function MusicasPage() {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: 1,
      title: "Por Eso Te Amo",
      artist: "Río Roma",
      src: "/music/por-eso-te-amo.mp3", // Ruta ficticia
      cover: "/placeholder.svg?height=400&width=400",
      color: "from-pink-500 to-rose-600",
      dedicatoria:
        "Esta canción me recuerda el día que te conocí. Cada palabra refleja exactamente lo que sentí cuando nuestras miradas se cruzaron por primera vez.\n\nCada vez que la escucho, revivo ese momento mágico que cambió mi vida para siempre. Te amo por ser exactamente quien eres.",
    },
    {
      id: 2,
      title: "Perfect",
      artist: "Ed Sheeran",
      src: "/music/perfect.mp3", // Ruta ficticia
      cover: "/placeholder.svg?height=400&width=400",
      color: "from-blue-500 to-purple-600",
      dedicatoria:
        "Bailamos esta canción bajo las estrellas en nuestro aniversario. Fue un momento perfecto, como dice la letra.\n\nCuando la escucho, siento tus manos en mi cintura y veo tu sonrisa iluminada por la luna. Eres perfecta para mí en todos los sentidos.",
    },
    {
      id: 3,
      title: "A Thousand Years",
      artist: "Christina Perri",
      src: "/music/a-thousand-years.mp3", // Ruta ficticia
      cover: "/placeholder.svg?height=400&width=400",
      color: "from-purple-500 to-indigo-600",
      dedicatoria:
        "Esta canción representa la eternidad de nuestro amor. Te he amado durante mil años y te amaré por mil más.\n\nCada nota musical me transporta a un mundo donde solo existimos tú y yo, donde el tiempo se detiene y nuestro amor es lo único que importa.",
    },
    {
      id: 4,
      title: "Eres Tú",
      artist: "Carla Morrison",
      src: "/music/eres-tu.mp3", // Ruta ficticia
      cover: "/placeholder.svg?height=400&width=400",
      color: "from-green-500 to-teal-600",
      dedicatoria:
        "La primera vez que escuché esta canción, inmediatamente pensé en ti. Cada palabra describe perfectamente lo que siento.\n\nEres tú quien ilumina mis días oscuros, quien me hace sonreír cuando quiero llorar, quien me enseña a amar sin miedo.",
    },
    {
      id: 5,
      title: "All of Me",
      artist: "John Legend",
      src: "/music/all-of-me.mp3", // Ruta ficticia
      cover: "/placeholder.svg?height=400&width=400",
      color: "from-yellow-500 to-amber-600",
      dedicatoria:
        "Te entrego todo de mí, como dice esta canción. Amo todas tus curvas y todos tus bordes, todas tus perfectas imperfecciones.\n\nIncluso cuando pierdo, estoy ganando, porque te tengo a mi lado. Eres mi principio y mi final, mi todo.",
    },
    {
      id: 6,
      title: "Tu Vida en la Mía",
      artist: "Marc Anthony",
      src: "/music/tu-vida-en-la-mia.mp3", // Ruta ficticia
      cover: "/placeholder.svg?height=400&width=400",
      color: "from-red-500 to-orange-600",
      dedicatoria:
        "Esta canción representa cómo nuestras vidas se han entrelazado para formar una sola. Tu vida en la mía, y la mía en la tuya.\n\nCada momento que pasamos juntos es un tesoro que guardo en mi corazón. Gracias por compartir tu vida conmigo.",
    },
    {
      id: 7,
      title: "Photograph",
      artist: "Ed Sheeran",
      src: "/music/photograph.mp3", // Ruta ficticia
      cover: "/placeholder.svg?height=400&width=400",
      color: "from-sky-500 to-blue-600",
      dedicatoria:
        "Como dice esta canción, podemos guardar nuestro amor en fotografías, mantenerlo dentro de nuestros corazones rotos.\n\nCada foto que tenemos juntos cuenta una historia, un momento de felicidad que vivirá para siempre en nuestra memoria.",
    },
    {
      id: 8,
      title: "Thinking Out Loud",
      artist: "Ed Sheeran",
      src: "/music/thinking-out-loud.mp3", // Ruta ficticia
      cover: "/placeholder.svg?height=400&width=400",
      color: "from-emerald-500 to-green-600",
      dedicatoria:
        "Cuando tenga 70 años, seguiré amándote de la misma manera. Nuestro amor es eterno, como dice esta canción.\n\nLa gente sigue enamorándose de formas misteriosas, y yo me enamoro de ti cada día un poco más.",
    },
  ])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        title="Nuestras Canciones"
        description="La banda sonora de nuestro amor, cada melodía un recuerdo especial"
      />

      <MusicPlayer initialSongs={songs} />

      <div className="mt-12 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-pink-100">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">El Poder de la Música en Nuestra Historia</h2>
        <p className="text-gray-700 mb-4">
          La música tiene el poder mágico de transportarnos en el tiempo, de hacernos revivir momentos especiales con
          solo escuchar las primeras notas de una canción. Cada melodía en esta playlist es un capítulo de nuestra
          historia de amor.
        </p>
        <p className="text-gray-700 mb-4">
          Algunas canciones nos recuerdan nuestros primeros momentos juntos, otras nos transportan a celebraciones
          especiales, y algunas simplemente se convirtieron en "nuestras" porque estaban sonando en momentos cotidianos
          que, sin saberlo, se volverían recuerdos preciosos.
        </p>
        <p className="text-gray-700">
          Esta colección musical es un tesoro que irá creciendo con el tiempo, añadiendo nuevas melodías que marcarán
          los futuros capítulos de nuestro amor. Cada canción es una dedicatoria, un mensaje, una promesa de amor
          eterno.
        </p>
      </div>
    </div>
  )
}
