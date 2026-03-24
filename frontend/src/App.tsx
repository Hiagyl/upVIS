import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import DonorsPage from './pages/DonorsPage';
import ScholarsPage from './pages/ScholarsPage';
import MembersPage from './pages/MembersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      {/* Landing Page (FIRST PAGE) */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/donors" element={<DonorsPage />} />
      <Route path="/scholars" element={<ScholarsPage />} />
      <Route path="/members" element={<MembersPage />} />

      {/* 404 */}
      <Route path="*" element={<div className="ml-64 p-8">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
