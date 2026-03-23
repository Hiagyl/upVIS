import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import DonorsPage from './pages/DonorsPage';
import ScholarsPage from './pages/ScholarsPage';
import MembersPage from './pages/MembersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


// Redirects to /login if no token is found
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

function App() {
    return (
        <Routes>

            {/*Public-only Routes */}
            <Route path="/login" element={
                <PublicRoute>
                    <LoginPage />
                </PublicRoute>
                }
            />
            <Route path="/register" element={
                <PublicRoute>
                    <RegisterPage />
                </PublicRoute>
                }
            />

            {/* Private Routes/needs to be logged in */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
                }
            />
            <Route path="/transactions" element={
                <ProtectedRoute>
                    <TransactionsPage />
                </ProtectedRoute>
                }
            />
            <Route path="/donors" element={
                <ProtectedRoute>
                    <DonorsPage />
                </ProtectedRoute>
                }
            />
            <Route path="/scholars" element={
                <ProtectedRoute>
                    <ScholarsPage />
                </ProtectedRoute>
                }
            />
            <Route path="/members" element={
                <ProtectedRoute>
                   <MembersPage />
                </ProtectedRoute>
                }
            />

            {/* 404 Handler */}
            <Route path="*" element={<div className="ml-64 p-8">404 - Page Not Found</div>} />
        </Routes>
  );
}

export default App;
