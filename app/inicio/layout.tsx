import type React from "react"
import Sidebar from "@/components/sidebar"
import FloatingHearts from "@/components/floating-hearts"

export default function InteriorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden">
        <FloatingHearts />
        {children}
      </main>
    </div>
  )
}
