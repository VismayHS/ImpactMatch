import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');
  const user = localStorage.getItem('user');

  // Check if user is authenticated
  if (!token || !userId || !user) {
    // Redirect to appropriate login page based on required role
    const loginPath = requiredRole ? `/login/${requiredRole}` : '/login/user';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (requiredRole && userRole !== requiredRole) {
    // User is logged in but doesn't have the right role
    // Redirect to their appropriate dashboard or the required login
    const redirectPath = userRole ? `/dashboard/${userRole}` : `/login/${requiredRole}`;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute;
