
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = () => {
  const { userId } = useAuth();

  // If there's no userId in our context, redirect to the login page
  if (!userId) {
    // You can also pass the original location to redirect back after login
    // return <Navigate to="/login" state={{ from: location }} replace />;
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the child routes (e.g., dashboard, settings)
  return <Outlet />;
};