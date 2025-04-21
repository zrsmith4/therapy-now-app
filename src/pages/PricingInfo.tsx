
import React from "react"
import { Card, CardContent } from "@/components/ui/card"

const VISIT_TYPES = [
  {
    type: "Mobile (In-Home) PT Visit",
    price: "$165",
    duration: "45-60 min",
    description: "A full session provided at the patient's location."
  },
  {
    type: "Clinic PT Visit",
    price: "$150",
    duration: "45-60 min",
    description: "A traditional visit in the therapist's clinic."
  },
  {
    type: "Dry Needling Visit",
    price: "$60",
    duration: "30 min",
    description: "Targeted dry needling session."
  },
  {
    type: "Telehealth Visit",
    price: "$60",
    duration: "30 min",
    description: "Virtual physical therapy session over video call."
  }
];

const PricingInfo = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="container px-4 py-12">
      <h1 className="text-4xl font-bold text-medical-primary mb-4 text-center">
        Service Pricing & Visit Types
      </h1>
      <p className="mb-8 text-lg text-slate-600 text-center">
        Review our visit types, durations, and associated costs. These rates apply to all patients and are what therapists receive for completed sessions.
      </p>
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {VISIT_TYPES.map((v, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">{v.type}</h2>
              <p className="text-2xl font-semibold mb-2">{v.price}</p>
              <p className="mb-2 text-slate-700">{v.duration}</p>
              <p className="text-slate-500">{v.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
)

export default PricingInfo
