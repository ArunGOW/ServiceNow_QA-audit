 import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import ProcessedQAPage from "./pages/ProcessedQAPage";
import GroomingPage from "./pages/GroomingPage";
import ImportIncidentPage from "./pages/ImportIncidentPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
         <Route path="/pending-qa" element={<Dashboard filter="Pending" />}  />
         <Route
          path="/dashboard/*"
          element={
            <Layout>
              <Routes>
                {/* <Route path="pending" element={<PendingQAPage />} /> */}
                <Route path="processed-qa" element={<ProcessedQAPage />} />
                <Route path="pending-grooming" element={<GroomingPage />} />
                <Route path="import-incident" element={<ImportIncidentPage />} />
              </Routes>
            </Layout>
          }
        />
       </Routes>
    </AuthProvider>
  );
}

export default App;
