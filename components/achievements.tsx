"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Star, Award, Target, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Plan } from "./plan-card"

export interface Achievement {
  id: number
  title: string
  description: string
  icon: "trophy" | "medal" | "star" | "award" | "target" | "calendar"
  progress: number
  total: number
  unlocked: boolean
}

interface AchievementsProps {
  plans: Plan[]
}

export default function Achievements({ plans }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "¡Primer Plan!",
      description: "Crea tu primer plan juntos",
      icon: "trophy",
      progress: 0,
      total: 1,
      unlocked: false,
    },
    {
      id: 2,
      title: "Maestro de Planes",
      description: "Crea 10 planes juntos",
      icon: "medal",
      progress: 0,
      total: 10,
      unlocked: false,
    },
    {
      id: 3,
      title: "¡Completista!",
      description: "Completa 5 planes",
      icon: "star",
      progress: 0,
      total: 5,
      unlocked: false,
    },
    {
      id: 4,
      title: "Aventureros",
      description: "Completa 3 planes de vacaciones",
      icon: "award",
      progress: 0,
      total: 3,
      unlocked: false,
    },
    {
      id: 5,
      title: "Románticos",
      description: "Completa 3 planes de citas",
      icon: "target",
      progress: 0,
      total: 3,
      unlocked: false,
    },
    {
      id: 6,
      title: "Dúo Organizado",
      description: "Crea planes para 3 meses diferentes en el calendario",
      icon: "calendar",
      progress: 0,
      total: 3,
      unlocked: false,
    },
  ])

  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem("achievements")
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  // Check achievements whenever plans change
  useEffect(() => {
    const updatedAchievements = [...achievements]
    let newUnlocked = false
    let lastUnlocked: Achievement | null = null

    // Check each achievement
    updatedAchievements.forEach((achievement) => {
      let progress = 0

      switch (achievement.id) {
        case 1: // First plan
          progress = plans.length > 0 ? 1 : 0
          break
        case 2: // 10 plans
          progress = Math.min(plans.length, 10)
          break
        case 3: // Complete 5 plans
          progress = Math.min(plans.filter((plan) => plan.completed).length, 5)
          break
        case 4: // Complete 3 vacation plans
          progress = Math.min(plans.filter((plan) => plan.completed && plan.category === "vacaciones").length, 3)
          break
        case 5: // Complete 3 date plans
          progress = Math.min(plans.filter((plan) => plan.completed && plan.category === "cita").length, 3)
          break
        case 6: // Plans for 3 different months
          const months = new Set(plans.map((plan) => new Date(plan.date).toISOString().substring(0, 7)))
          progress = Math.min(months.size, 3)
          break
      }

      // Update progress
      achievement.progress = progress

      // Check if newly unlocked
      if (progress >= achievement.total && !achievement.unlocked) {
        achievement.unlocked = true
        newUnlocked = true
        lastUnlocked = achievement
      }
    })

    // Save updated achievements
    setAchievements(updatedAchievements)
    localStorage.setItem("achievements", JSON.stringify(updatedAchievements))

    // Show notification if new achievement unlocked
    if (newUnlocked && lastUnlocked) {
      setNewAchievement(lastUnlocked)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
    }
  }, [plans])

  const getIcon = (iconName: Achievement["icon"]) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case "medal":
        return <Medal className="h-6 w-6 text-blue-500" />
      case "star":
        return <Star className="h-6 w-6 text-purple-500" />
      case "award":
        return <Award className="h-6 w-6 text-green-500" />
      case "target":
        return <Target className="h-6 w-6 text-pink-500" />
      case "calendar":
        return <Calendar className="h-6 w-6 text-orange-500" />
    }
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Nuestros Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unlockedAchievements.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100"
                    >
                      <div className="flex-shrink-0">{getIcon(achievement.icon)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Progress value={(achievement.progress / achievement.total) * 100} className="h-1.5" />
                          <span className="text-xs text-gray-500 ml-2">
                            {achievement.progress}/{achievement.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {lockedAchievements.length > 0 && (
                  <>
                    <h4 className="text-sm font-medium text-gray-700 mt-4">Próximos logros</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lockedAchievements.slice(0, 2).map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="flex-shrink-0 opacity-50">{getIcon(achievement.icon)}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-600">{achievement.title}</h4>
                            <p className="text-xs text-gray-500">{achievement.description}</p>
                            <div className="flex items-center justify-between mt-1">
                              <Progress value={(achievement.progress / achievement.total) * 100} className="h-1.5" />
                              <span className="text-xs text-gray-500 ml-2">
                                {achievement.progress}/{achievement.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-600 mb-1">¡Aún no hay logros!</h3>
                <p className="text-sm text-gray-500">Completa planes juntos para desbloquear logros especiales</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievement notification */}
      {showNotification && newAchievement && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
          <Alert className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">{getIcon(newAchievement.icon)}</div>
              <AlertDescription className="font-medium">
                <div className="text-sm">¡Logro desbloqueado!</div>
                <div className="text-lg font-bold">{newAchievement.title}</div>
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
    </>
  )
}
