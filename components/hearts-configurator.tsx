"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"

interface HeartsConfiguratorProps {
  config: {
    count: number
    minSize: number
    maxSize: number
    minSpeed: number
    maxSpeed: number
    interactive: boolean
    colors: string[]
    density: "low" | "medium" | "high"
    effects: {
      pulse: boolean
      glow: boolean
      swirl: boolean
      parallax: boolean
    }
  }
  onChange: (config: any) => void
}

export default function HeartsConfigurator({ config, onChange }: HeartsConfiguratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null)

  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value })
  }

  const updateEffect = (key: string, value: boolean) => {
    onChange({
      ...config,
      effects: {
        ...config.effects,
        [key]: value,
      },
    })
  }

  const updateColor = (index: number, color: string) => {
    const newColors = [...config.colors]
    newColors[index] = color
    onChange({ ...config, colors: newColors })
  }

  const addColor = () => {
    onChange({ ...config, colors: [...config.colors, "#ff80ab"] })
  }

  const removeColor = (index: number) => {
    if (config.colors.length <= 1) return
    const newColors = [...config.colors]
    newColors.splice(index, 1)
    onChange({ ...config, colors: newColors })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-gray-800 shadow-md">
            <Settings className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side="top">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Configuración de Corazones</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="count">Cantidad</Label>
                <span className="text-sm text-muted-foreground">{config.count}</span>
              </div>
              <Slider
                id="count"
                min={5}
                max={100}
                step={1}
                value={[config.count]}
                onValueChange={(value) => updateConfig("count", value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="density">Densidad</Label>
              <Select
                value={config.density}
                onValueChange={(value: "low" | "medium" | "high") => updateConfig("density", value)}
              >
                <SelectTrigger id="density">
                  <SelectValue placeholder="Densidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="size">Tamaño (min-max)</Label>
                <span className="text-sm text-muted-foreground">
                  {config.minSize}-{config.maxSize}px
                </span>
              </div>
              <div className="flex gap-2">
                <Slider
                  id="minSize"
                  min={5}
                  max={50}
                  step={1}
                  value={[config.minSize]}
                  onValueChange={(value) => updateConfig("minSize", value[0])}
                />
                <Slider
                  id="maxSize"
                  min={10}
                  max={60}
                  step={1}
                  value={[config.maxSize]}
                  onValueChange={(value) => updateConfig("maxSize", value[0])}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="speed">Velocidad (min-max)</Label>
                <span className="text-sm text-muted-foreground">
                  {config.minSpeed}-{config.maxSpeed}
                </span>
              </div>
              <div className="flex gap-2">
                <Slider
                  id="minSpeed"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={[config.minSpeed]}
                  onValueChange={(value) => updateConfig("minSpeed", value[0])}
                />
                <Slider
                  id="maxSpeed"
                  min={1}
                  max={10}
                  step={0.1}
                  value={[config.maxSpeed]}
                  onValueChange={(value) => updateConfig("maxSpeed", value[0])}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Colores</Label>
              <div className="flex flex-wrap gap-2">
                {config.colors.map((color, index) => (
                  <div key={index} className="relative">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingColorIndex(index === editingColorIndex ? null : index)}
                    />
                    {config.colors.length > 1 && (
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full w-4 h-4 flex items-center justify-center border border-gray-300"
                        onClick={() => removeColor(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    {editingColorIndex === index && (
                      <div className="absolute z-10 mt-2">
                        <HexColorPicker color={color} onChange={(newColor) => updateColor(index, newColor)} />
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center"
                  onClick={addColor}
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Efectos</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="interactive" className="cursor-pointer">
                    Interactivo
                  </Label>
                  <Switch
                    id="interactive"
                    checked={config.interactive}
                    onCheckedChange={(checked) => updateConfig("interactive", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pulse" className="cursor-pointer">
                    Pulsación
                  </Label>
                  <Switch
                    id="pulse"
                    checked={config.effects.pulse}
                    onCheckedChange={(checked) => updateEffect("pulse", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="glow" className="cursor-pointer">
                    Brillo
                  </Label>
                  <Switch
                    id="glow"
                    checked={config.effects.glow}
                    onCheckedChange={(checked) => updateEffect("glow", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="swirl" className="cursor-pointer">
                    Remolino
                  </Label>
                  <Switch
                    id="swirl"
                    checked={config.effects.swirl}
                    onCheckedChange={(checked) => updateEffect("swirl", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="parallax" className="cursor-pointer">
                    Profundidad
                  </Label>
                  <Switch
                    id="parallax"
                    checked={config.effects.parallax}
                    onCheckedChange={(checked) => updateEffect("parallax", checked)}
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                // Save configuration to localStorage
                localStorage.setItem("heartsConfig", JSON.stringify(config))
                setIsOpen(false)
              }}
            >
              Guardar Configuración
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
