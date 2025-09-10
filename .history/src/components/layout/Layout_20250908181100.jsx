// src/components/layout/Layout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-primary text-white transition-all ${
          collapsed ? "d-none" : "d-block"
        }`}
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Topbar onToggleSidebar={() => setCollapsed(!collapsed)} />
        <div className="p-4 bg-light" style={{ minHeight: "100vh" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
