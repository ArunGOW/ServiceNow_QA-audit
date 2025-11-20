
// src/components/Dashboard.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./layout/sidebar.jsx";
import Topbar from "./layout/Topbar.jsx";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar />}

      {/* Main Content */}
      <div className="flex-grow-1">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-3">
          <Outlet /> {/* Child routes render here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
