import { Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex justify-end w-full">
        <Button variant="ghost" size="icon" className="text-pink-500">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-pink-500">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-pink-600 text-center">{title}</h1>
      {description && <p className="text-center text-muted-foreground mt-2 max-w-lg">{description}</p>}
    </div>
  )
}
