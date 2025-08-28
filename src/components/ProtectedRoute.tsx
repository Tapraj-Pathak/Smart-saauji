import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute;


