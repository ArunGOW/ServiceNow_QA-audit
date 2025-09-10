 import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import ImportExcel from "./components/ImportExcel";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
         <Route path="/pending-qa" element={<Dashboard filter="Pending" />}  />
         <Route path="/processed-qa"  element={<Dashboard />} />
        <Route path="/import-excel" element={<ImportExcel />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
