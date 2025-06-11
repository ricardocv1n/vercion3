"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Heart, MessageSquareText, ImageIcon, Music, Gift, Calendar, Users, LogOut } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { name: "Inicio", href: "/inicio", icon: Home },
    { name: "Nuestros Recuerdos", href: "/recuerdos", icon: Heart },
    { name: "Mensajes Especiales", href: "/mensajes", icon: MessageSquareText },
    { name: "Nuestras Fotos", href: "/fotos", icon: ImageIcon },
    { name: "Nuestras Músicas", href: "/musicas", icon: Music },
    { name: "Sorpresas", href: "/sorpresas", icon: Gift },
    { name: "Nuestros Planes", href: "/planes", icon: Calendar },
  ]

  const handleLogout = () => {
    // Clear localStorage data
    localStorage.removeItem("anniversaryDate")
    localStorage.removeItem("userName")

    // Redirect to login page
    router.push("/")
  }

  return (
    <aside className="w-[200px] bg-pink-600 text-white flex flex-col min-h-screen">
      <div className="p-4 flex items-center gap-2 border-b border-pink-500">
        <Users className="h-6 w-6" />
        <h1 className="text-xl font-bold">Mi Amor</h1>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-white text-pink-600" : "hover:bg-pink-500"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}

          {/* Add logout button */}
          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-pink-500"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
