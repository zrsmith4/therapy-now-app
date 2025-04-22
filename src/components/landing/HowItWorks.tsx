
import React from 'react';

const HowItWorks = () => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">How It Works</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center text-medical-primary font-bold text-xl mb-4 mx-auto">
            1
          </div>
          <h3 className="font-semibold mb-2">Book Your Appointment</h3>
          <p className="text-sm text-slate-500">
            Choose a therapist and schedule an appointment at your convenience
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center text-medical-primary font-bold text-xl mb-4 mx-auto">
            2
          </div>
          <h3 className="font-semibold mb-2">Choose Your Location</h3>
          <p className="text-sm text-slate-500">
            Decide if you want the therapist to come to you, visit their clinic, or have a virtual session
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center text-medical-primary font-bold text-xl mb-4 mx-auto">
            3
          </div>
          <h3 className="font-semibold mb-2">Receive Expert Care</h3>
          <p className="text-sm text-slate-500">
            Get the physical therapy you need from qualified professionals
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
