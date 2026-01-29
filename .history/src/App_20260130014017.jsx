 import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import { ROLES } from "./constants/roles";

// Components
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// Pages
import PendingQAPage from "./pages/PendingQAPage";
import ProcessedQAPage from "./pages/ProcessedQAPage";
import GroomingPage from "./pages/GroomingPage";
import ImportIncidentPage from "./pages/ImportIncidentPage";
import UnassignedPage from "./pages/UnassignedPage";
import UserDashboard from "./pages/UserDashboard";
import AlluserDashboard from "./pages/AlluserDashboard";
import UpdateIncident from "./pages/UpdateIncident";
import PendingIncidentsTab from "./pages/PendingIncidentsTab";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}>
          {/* 🔹 Default redirect */}
          <Route index element={<Navigate to="alluser-dashboard" replace />} />

          {/* 🔐 COMMON ROUTES (ADMIN + AGENT) */}
          <Route
            element={
              <RoleProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}
              />
            }
          >
            
            
            <Route path="update-incident" element={<UpdateIncident />} />
             
          </Route>

          <Route
  element={
    <RoleProtectedRoute allowedRoles={[ROLES.AGENT]} />
  }
>
  <Route
    path="pending-incident"
    element={<PendingIncidentsTab />}
  />
  <Route path="user-dashboard" element={<UserDashboard />} />
</Route>

          {/* 🔐 ADMIN ONLY ROUTES */}
          <Route
            element={
              <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />
            }
          >
            <Route
              path="alluser-dashboard"
              element={<AlluserDashboard />}
            />
            <Route path="pending-qa" element={<PendingQAPage />} />
            <Route
              path="processed-qa"
              element={<ProcessedQAPage />}
            />
            <Route
              path="pending-grooming"
              element={<GroomingPage />}
            />
            <Route
              path="import-incident"
              element={<ImportIncidentPage />}
            />
            <Route path="update-incident" element={<UpdateIncident />} />
            <Route
              path="unassigned-incident"
              element={<UnassignedPage />}
            />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
