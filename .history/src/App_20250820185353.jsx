import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './components/Login.jsx';
import Layout from './components/Layout.jsx';
import AgentDashboard from './pages/AgentDashboard.jsx';
import QADashboard from './pages/QADashboard.jsx';
import ImportIncidents from './pages/ImportIncidents.jsx';

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      {!user ? (
        <Login />
      ) : (
        <Layout>
          <Routes>
            {user.role === 'agent' && (
              <Route path="/" element={<AgentDashboard />} />
            )}
            {user.role === 'qa' && (
              <>
                <Route path="/" element={<QADashboard />} />
                <Route path="/import" element={<ImportIncidents />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}