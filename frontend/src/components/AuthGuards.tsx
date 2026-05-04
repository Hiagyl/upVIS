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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

/* =========================
   2. AUTH PROVIDER
========================= */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initial session check (runs once on app load)
  useEffect(() => {
    let mounted = true;
    authService
      .checkStatus()
      .then((res) => {
        if (mounted) {
          // FIX 1: Ensure we only set a valid user object.
          // If the backend sends an empty object or error message on failure, reject it.
          if (res && res.role) {
            setUser(res);
          } else {
            setUser(null);
          }
        }
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    console.log("LOGIN RESPONSE:", res); // ADD THIS
    setUser(res);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   3. ROUTE GUARDS
========================= */

// Protects internal pages (Admin/Student)
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

  // 1. Check if user is logged in at all
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has the specific role required for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // FIX 2: Break the loop by strictly mapping roles to their designated home pages.
    // Never send an unknown role to a guarded page.
    if (user.role === "student") {
      return <Navigate to="/student-poll" replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    // Absolute fallback: Send completely unknown roles back to the landing page.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Prevents logged-in users from seeing Login/Register
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user && user.role) {
    // FIX 3: Safely route an already-logged-in user trying to access /login
    const target = user.role === "student" ? "/student-poll" : "/dashboard";
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
