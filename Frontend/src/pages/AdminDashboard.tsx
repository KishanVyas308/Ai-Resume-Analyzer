import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../components/AdminPage';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
     
        <AdminPage />
      
    </div>
  );
};

export default AdminDashboard;
