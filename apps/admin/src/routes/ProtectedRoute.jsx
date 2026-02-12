import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    logout();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
