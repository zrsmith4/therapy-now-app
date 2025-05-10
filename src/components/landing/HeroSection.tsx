import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const HeroSection = () => {
  return <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">
        <span className="text-medical-primary">Therapy</span>
        <span className="text-medical-secondary">Now</span>
      </h1>
      <p className="text-xl text-slate-600 mb-12">
        On-demand physical therapy when and where you need it
      </p>
      
      <div className="mt-8 flex justify-center space-x-4 py-[10px]">
        <Button asChild className="bg-medical-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-medical-dark transition-colors">
          <Link to="/signup">Sign Up</Link>
        </Button>
        <Button asChild variant="outline" className="font-semibold py-2 px-6 rounded-lg border-medical-primary text-medical-primary hover:bg-medical-light transition-colors">
          <Link to="/pricing">View Pricing</Link>
        </Button>
      </div>
    </div>;
};
export default HeroSection;