
import React from "react"
import { Button } from "@/components/ui/button"
import { User, Stethoscope } from "lucide-react"
import { useNavigate } from "react-router-dom"

const SignUpChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-medical-primary mb-6">Sign Up As</h2>
        <div className="space-y-5">
          <Button
            className="w-full flex items-center gap-3 py-6 text-lg"
            onClick={() => navigate('/patient-signup')}
          >
            <User className="h-5 w-5 text-medical-primary" />
            Patient
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-3 py-6 text-lg"
            onClick={() => navigate('/therapist-signup')}
          >
            <Stethoscope className="h-5 w-5 text-medical-tertiary" />
            Therapist
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SignUpChoice
