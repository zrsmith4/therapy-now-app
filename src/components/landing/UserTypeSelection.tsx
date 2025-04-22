
import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type UserType = 'patient' | 'therapist' | null;

interface UserTypeSelectionProps {
  onSelectUserType: (type: UserType) => void;
}

const UserTypeSelection = ({ onSelectUserType }: UserTypeSelectionProps) => {
  const navigate = useNavigate();
  
  const handleTherapistClick = () => {
    navigate('/login', { state: { userType: 'therapist' } });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
      <div
        className="rounded-lg p-8 bg-white shadow-md border-2 border-transparent hover:border-medical-primary cursor-pointer transition-all"
        onClick={() => onSelectUserType('patient')}
      >
        <User className="w-12 h-12 text-medical-primary mb-4 mx-auto" />
        <h2 className="text-xl font-bold mb-2">I'm a Patient</h2>
        <p className="text-slate-500">
          Find and book appointments with qualified physical therapists when and where you need them.
        </p>
      </div>
      
      <div
        className="rounded-lg p-8 bg-white shadow-md border-2 border-transparent hover:border-medical-tertiary cursor-pointer transition-all"
        onClick={handleTherapistClick}
      >
        <User className="w-12 h-12 text-medical-tertiary mb-4 mx-auto" />
        <h2 className="text-xl font-bold mb-2">I'm a Therapist</h2>
        <p className="text-slate-500">
          Manage your schedule, set your availability, and connect with patients who need your expertise.
        </p>
      </div>
    </div>
  );
};

export default UserTypeSelection;
