 // src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";

// ✅ Import pages (not table components!)
import PendingQAPage from "./pages/PendingQAPage";
import ProcessedQAPage from "./pages/ProcessedQAPage";
import GroomingPage from "./pages/GroomingPage";
import ImportIncidentPage from "./pages/ImportIncidentPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard main */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ Sub-routes under dashboard */}
        <Route path="/dashboard/pending-qa" element={<PendingQAPage />} />
        <Route path="/dashboard/processed-qa" element={<ProcessedQAPage />} />
        <Route path="/dashboard/pending-grooming" element={<GroomingPage />} />
        <Route path="/dashboard/import-incident" element={<ImportIncidentPage />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
