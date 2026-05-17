// AuthGuards.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Navigate, useLocation } from "react-router-dom";

import { authService } from "../services/api";

/* =========================
   1. CONTEXT & HOOK
========================= */

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

/* =========================
   2. AUTH PROVIDER
========================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // Initial session check
  useEffect(() => {
    let mounted = true;

    authService
      .checkStatus()

      .then((res) => {
        if (mounted) {
          if (res && res.user) {
            setUser(res.user);
          } else {
            setUser(null);
          }
        }
      })

      .catch(() => {
        if (mounted) {
          setUser(null);
        }
      })

      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);

    const normalizedUser = res.user;

    setUser(normalizedUser);

    return normalizedUser;
  };

  const logout = async () => {
    await authService.logout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   3. ROUTE GUARDS
========================= */

// Protects internal pages
export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-center">Verifying session...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role protection
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Scholar pages
    if (user.role === "scholar") {
      return <Navigate to="/student-poll" replace />;
    }

    // Admin or member pages
    if (user.role === "admin" || user.role === "member") {
      return <Navigate to="/dashboard" replace />;
    }

    // Fallback
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Prevents logged-in users
// from seeing login/register
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user && user.role) {
    const target = user.role === "scholar" ? "/student-poll" : "/dashboard";

    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
