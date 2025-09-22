import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import TutorDashboard from '../components/dashboards/TutorDashboard';
import EmployerDashboard from '../components/dashboards/EmployerDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  const renderRoleDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'tutor':
        return <TutorDashboard />;
      case 'employer':
        return <EmployerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />; // Default to student dashboard
    }
  };

  return renderRoleDashboard();
};

export default Dashboard;
