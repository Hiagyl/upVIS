import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

// You can create these placeholder pages later
const TransactionsPage = () => <div className="ml-64 p-8">Transactions Content Coming Soon</div>;
const DonorsPage = () => <div className="ml-64 p-8">Donors Content Coming Soon</div>;

function App() {
  return (
    <Routes>
      {/* This renders the Dashboard when the path is exactly "/" */}
      <Route path="/" element={<Dashboard />} />

      {/* These match the 'href' values we put in your Sidebar */}
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/donors" element={<DonorsPage />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<div className="ml-64 p-8">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;