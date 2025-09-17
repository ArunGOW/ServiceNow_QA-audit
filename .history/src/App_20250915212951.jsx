 

// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";

// Pages
import PendingQAPage from "./pages/PendingQAPage";
import ProcessedQAPage from "./pages/ProcessedQAPage";
import GroomingPage from "./pages/GroomingPage";
import ImportIncidentPage from "./pages/ImportIncidentPage";
import UnassignedPage from "./pages/UnassignedPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="pending-qa" element={<PendingQAPage />} />
          <Route path="processed-qa" element={<ProcessedQAPage />} />
          <Route path="pending-grooming" element={<GroomingPage />} />
          <Route path="import-incident" element={<ImportIncidentPage />} />
          <Route path="unassigned-incident" element={<UnassignedPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;



 
