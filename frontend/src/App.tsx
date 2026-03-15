import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import DonorsPage from "./pages/DonorsPage";
import ScholarsPage from "./pages/ScholarsPage";
import MembersPage from "./pages/MembersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/donors" element={<DonorsPage />} />
      <Route path="/scholars" element={<ScholarsPage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route
        path="*"
        element={<div className="ml-64 p-8">404 - Page Not Found</div>}
      />
    </Routes>
  );
}

export default App;
