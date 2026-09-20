import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-20 text-center text-slate-300">Loading your SmartBuy workspace...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
