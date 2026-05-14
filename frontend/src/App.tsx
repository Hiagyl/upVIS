import { Routes, Route } from "react-router-dom";

// Auth logic
import {
  AuthProvider,
  ProtectedRoute,
  PublicRoute,
} from "./components/AuthGuards";

// Pages
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import DonorsPage from "./pages/DonorsPage";
import ScholarsPage from "./pages/ScholarsPage";
import MembersPage from "./pages/MembersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import ApplyPage from "./pages/ApplyPage";
import ApplicationsReviewPage from "./pages/ApplicationsReviewPage";
import LogoutTestPage from "./pages/LogoutTestPage";
import StudentPoll from "./pages/StudentPoll";
import AdminPoll from "./pages/AdminPoll";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* =========================================================
            1. PUBLIC ROUTES
           ========================================================= */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplyPage />} />

        {/* =========================================================
            2. AUTH ROUTES
           ========================================================= */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* =========================================================
            3. STUDENT ROUTES
           ========================================================= */}

        <Route
          path="/student-poll"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentPoll />
            </ProtectedRoute>
          }
        />

        {/* =========================================================
            4. ADMIN ROUTES
           ========================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ApplicationsReviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-poll"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPoll />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DonorsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scholars"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ScholarsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MembersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/logout-test"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LogoutTestPage />
            </ProtectedRoute>
          }
        />

        {/* =========================================================
            5. 404 PAGE
           ========================================================= */}

        <Route
          path="*"
          element={
            <div className="ml-64 p-8 text-2xl font-bold">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;