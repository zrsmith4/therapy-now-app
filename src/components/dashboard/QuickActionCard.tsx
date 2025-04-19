
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  buttonText: string
  onClick: () => void
}

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon,
  buttonText, 
  onClick 
}: QuickActionCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4">
          <Icon className="w-8 h-8 text-medical-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-4">{description}</p>
        <Button 
          onClick={onClick} 
          variant="outline" 
          className="w-full border-medical-primary text-medical-primary hover:bg-medical-light hover:text-medical-dark"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}

export default QuickActionCard
