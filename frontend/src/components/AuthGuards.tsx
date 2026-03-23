import { Navigate } from "react-router-dom";

// 1. Protects private pages (Dashboard, Members, etc.)
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// 2. Protects guest pages (Login, Register)
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};