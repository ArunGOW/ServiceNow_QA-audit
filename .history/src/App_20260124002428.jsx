 

// // src/App.jsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";
// import { AuthProvider } from "./context/AuthContext";

// // Pages
// import PendingQAPage from "./pages/PendingQAPage";
// import ProcessedQAPage from "./pages/ProcessedQAPage";
// import GroomingPage from "./pages/GroomingPage";
// import ImportIncidentPage from "./pages/ImportIncidentPage";
// import UnassignedPage from "./pages/UnassignedPage";
// import UserDashboard from "./pages/UserDashboard";
// import AlluserDashboard from "./pages/AlluserDashboard";
// import UpdateIncident from "./pages/UpdateIncident";

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         {/* Redirect root to login */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* Login Page */}
//         <Route path="/login" element={<Login />} />

//         {/* Dashboard Layout with nested routes */}
//         <Route path="/dashboard" element={<Dashboard />}>
//         <Route path="alluser-dashboard" element={<AlluserDashboard />} />
//           <Route path="pending-qa" element={<PendingQAPage />} />
//           <Route path="processed-qa" element={<ProcessedQAPage />} />
//           <Route path="pending-grooming" element={<GroomingPage />} />
//           <Route path="import-incident" element={<ImportIncidentPage />} />
//           <Route path="unassigned-incident" element={<UnassignedPage />} />
//           <Route path="UpdateIncident" element={<UpdateIncident />} />
//           <Route path="user-dashboard" element={<UserDashboard />} />
          
//         </Route>
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;



 


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

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
 

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}>

          {/* 🔐 QA ADMIN + AGENT (COMMON ROUTES) */}
          <Route
            element={
              <RoleProtectedRoute allowedRoles={["qa_admin", "agent"]} />
            }
          >
            <Route path="alluser-dashboard" element={<AlluserDashboard />} />
             <Route path="update-incident" element={<UpdateIncident />} />
          </Route>

          {/* 🔐 QA ADMIN ONLY ROUTES */}
          <Route
            element={
              <RoleProtectedRoute allowedRoles={["qa_admin"]} />
            }
          >
            
            <Route path="pending-qa" element={<PendingQAPage />} />
            <Route path="processed-qa" element={<ProcessedQAPage />} />
            <Route path="pending-grooming" element={<GroomingPage />} />
            <Route path="import-incident" element={<ImportIncidentPage />} />
            <Route path="unassigned-incident" element={<UnassignedPage />} />
          </Route>

        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
