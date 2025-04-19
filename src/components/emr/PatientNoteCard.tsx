
import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge-custom"

interface PatientNoteCardProps {
  patientName: string
  appointmentDate: string
  locationType: 'mobile' | 'clinic' | 'virtual'
  notes: string
  treatmentType: string
  onEdit: () => void
  onViewComplete: () => void
}

const PatientNoteCard = ({
  patientName,
  appointmentDate,
  locationType,
  notes,
  treatmentType,
  onEdit,
  onViewComplete
}: PatientNoteCardProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-lg">{patientName}</h3>
              <Badge variant={locationType}>{locationType} Visit</Badge>
              <Badge variant="subtle">{treatmentType}</Badge>
            </div>
            
            <p className="text-sm text-slate-500 mb-3">{appointmentDate}</p>
            
            <div className="border-l-4 border-medical-light pl-3 py-1 mb-3">
              <p className="text-slate-700">
                {notes.length > 150 ? `${notes.substring(0, 150)}...` : notes}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 py-3 bg-slate-50 flex justify-end gap-2 border-t">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit Notes
        </Button>
        <Button size="sm" onClick={onViewComplete} className="bg-medical-primary hover:bg-medical-dark">
          View Complete
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PatientNoteCard
