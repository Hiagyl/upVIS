import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/api";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
     authService
      .checkStatus()
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex h-screen items-center justify-center font-medium">
        Verifying session...
      </div>
    );
  }

  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

// 2. Protects guest pages (Login, Register) - Prevents logged-in users from seeing Login
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    authService
      .checkStatus()
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex h-screen items-center justify-center font-medium">
        Checking status...
      </div>
    );
  }

  // If already logged in, send them to the home page/dashboard
  return isAuth ? <Navigate to="/" replace /> : <>{children}</>;
};
