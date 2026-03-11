import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";

import Finance from "./pages/finance";
import Transactions from "./pages/transactions";
import Distributions from "./pages/distributions";
import Scholars from "./pages/scholars";
import Members from "./pages/members";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Layout />}>

        <Route index element={<Navigate to="/finance" />} />

        <Route path="finance" element={<Finance />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="distributions" element={<Distributions />} />
        <Route path="scholars" element={<Scholars />} />
        <Route path="members" element={<Members />} />

      </Route>

    </Routes>
  );
}

export default App;