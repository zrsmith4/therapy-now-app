
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  // Redirect based on user type
  React.useEffect(() => {
    // For now, redirect to patient profile
    // In a real app, this would check auth status and user type
    navigate('/patient-profile');
  }, [navigate]);

  return null;
};

export default Profile;
