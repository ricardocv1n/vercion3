"use client"

import { useState, useEffect } from "react"
import PageHeader from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Plus, Search, X, CalendarIcon, ListFilter } from "lucide-react"
import PlanCard, { type Plan } from "@/components/plan-card"
import PlanForm from "@/components/plan-form"
import PlanCalendar from "@/components/plan-calendar"
import Achievements from "@/components/achievements"
import ConfirmDelete from "@/components/confirm-delete"

export default function PlanesPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([])
  const [activeTab, setActiveTab] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [planToDelete, setPlanToDelete] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  // Load plans from localStorage
  useEffect(() => {
    const savedPlans = localStorage.getItem("plans")
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans))
    } else {
      // Default example plans
      const defaultPlans: Plan[] = [
        {
          id: 1,
          title: "Cena de aniversario",
          description: "Celebrar nuestro aniversario en un restaurante especial",
          date: new Date(2025, 6, 15).toISOString(),
          category: "aniversario",
          priority: "alta",
          completed: false,
          order: 0,
          location: "Restaurante El Mirador",
        },
        {
          id: 2,
          title: "Viaje a la playa",
          description: "Fin de semana romántico en la costa",
          date: new Date(2025, 7, 10).toISOString(),
          category: "vacaciones",
          priority: "media",
          completed: false,
          order: 1,
        },
        {
          id: 3,
          title: "Picnic en el parque",
          description: "Tarde relajada con comida y música",
          date: new Date(2025, 5, 20).toISOString(),
          category: "cita",
          priority: "baja",
          completed: true,
          order: 2,
          location: "Parque Central",
        },
      ]
      setPlans(defaultPlans)
    }
  }, [])

  // Save plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("plans", JSON.stringify(plans))
  }, [plans])

  // Filter plans based on active tab and search query
  useEffect(() => {
    let filtered = [...plans]

    // Apply tab filter
    if (activeTab === "pendientes") {
      filtered = filtered.filter((plan) => !plan.completed)
    } else if (activeTab === "completados") {
      filtered = filtered.filter((plan) => plan.completed)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (plan) =>
          plan.title.toLowerCase().includes(query) ||
          plan.description.toLowerCase().includes(query) ||
          (plan.location && plan.location.toLowerCase().includes(query)),
      )
    }

    // Sort by date and then by order
    filtered.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime()
      }
      return a.order - b.order
    })

    setFilteredPlans(filtered)
  }, [plans, activeTab, searchQuery])

  const handleAddPlan = (planData: Omit<Plan, "id" | "order" | "completed">) => {
    const newPlan: Plan = {
      ...planData,
      id: Date.now(),
      order: plans.length,
      completed: false,
    }

    setPlans([...plans, newPlan])
    setShowPlanForm(false)
  }

  const handleUpdatePlan = (planData: Omit<Plan, "id" | "order" | "completed">) => {
    if (!editingPlan) return

    const updatedPlan: Plan = {
      ...planData,
      id: editingPlan.id,
      order: editingPlan.order,
      completed: editingPlan.completed,
    }

    setPlans(plans.map((plan) => (plan.id === editingPlan.id ? updatedPlan : plan)))
    setEditingPlan(null)
    setShowPlanForm(false)
  }

  const handleToggleComplete = (id: number) => {
    setPlans(plans.map((plan) => (plan.id === id ? { ...plan, completed: !plan.completed } : plan)))
  }

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan)
    setShowPlanForm(true)
  }

  const handleDeletePlan = (id: number) => {
    setPlanToDelete(id)
  }

  const confirmDeletePlan = () => {
    if (planToDelete === null) return

    setPlans(plans.filter((plan) => plan.id !== planToDelete))
    setPlanToDelete(null)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        title="Nuestros Planes"
        description="Organiza y visualiza todas las actividades, metas y citas importantes de vuestra relación"
      />

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar planes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className={viewMode === "list" ? "rounded-none" : "rounded-none bg-transparent"}
              onClick={() => setViewMode("list")}
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              className={viewMode === "calendar" ? "rounded-none" : "rounded-none bg-transparent"}
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendario
            </Button>
          </div>

          <Button onClick={() => setShowPlanForm(true)} className="bg-pink-600 hover:bg-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          {viewMode === "list" ? (
            <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="completados">Completados</TabsTrigger>
              </TabsList>

              <TabsContent value="todos" className="space-y-4">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditPlan}
                      onDelete={handleDeletePlan}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">No hay planes</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchQuery
                        ? "No se encontraron planes que coincidan con tu búsqueda"
                        : "Comienza creando tu primer plan juntos"}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setShowPlanForm(true)} className="bg-pink-600 hover:bg-pink-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Plan
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pendientes" className="space-y-4">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditPlan}
                      onDelete={handleDeletePlan}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">No hay planes pendientes</h3>
                    <p className="text-sm text-gray-500">
                      {searchQuery
                        ? "No se encontraron planes pendientes que coincidan con tu búsqueda"
                        : "Todos tus planes están completados o aún no has creado ninguno"}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completados" className="space-y-4">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditPlan}
                      onDelete={handleDeletePlan}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">No hay planes completados</h3>
                    <p className="text-sm text-gray-500">
                      {searchQuery
                        ? "No se encontraron planes completados que coincidan con tu búsqueda"
                        : "Aún no has completado ningún plan"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <PlanCalendar plans={plans} onSelectPlan={handleEditPlan} />
          )}
        </div>

        {/* Sidebar with achievements */}
        <div>
          <Achievements plans={plans} />
        </div>
      </div>

      {/* Plan form modal */}
      <PlanForm
        isOpen={showPlanForm}
        onClose={() => {
          setShowPlanForm(false)
          setEditingPlan(null)
        }}
        onSave={editingPlan ? handleUpdatePlan : handleAddPlan}
        editingPlan={editingPlan}
      />

      {/* Confirm delete modal */}
      <ConfirmDelete
        isOpen={planToDelete !== null}
        onClose={() => setPlanToDelete(null)}
        onConfirm={confirmDeletePlan}
      />
    </div>
  )
}
