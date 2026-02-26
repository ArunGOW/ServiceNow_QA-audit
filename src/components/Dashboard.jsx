
// // src/components/Dashboard.jsx
// import { Outlet } from "react-router-dom";
// import { useState } from "react";
// import Sidebar from "./layout/sidebar.jsx";
// import Topbar from "./layout/Topbar.jsx";

// const Dashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="d-flex">
//       {/* Sidebar */}
//       {sidebarOpen && <Sidebar />}

//       {/* Main Content */}
//       <div className="flex-grow-1">
//         <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         <div className="p-3">
//           <Outlet /> {/* Child routes render here */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// src/components/Dashboard.jsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./layout/sidebar.jsx";
import Topbar from "./layout/Topbar.jsx";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Define sidebar width for easy maintenance
  const sidebarWidth = "260px"; 

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar - Positioned Fixed */}
      <div 
        style={{
          width: sidebarOpen ? sidebarWidth : "0px",
          transition: "width 0.3s ease",
          position: "fixed", // ✅ Keeps it from moving
          height: "100vh",
          zIndex: 1000,
          overflow: "hidden"
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content - Pushed to the right */}
      <div 
        className="flex-grow-1"
        style={{ 
          marginLeft: sidebarOpen ? sidebarWidth : "0px", // ✅ Prevents content overlap
          transition: "margin-left 0.3s ease",
          backgroundColor: "#f9fafb", // Optional: consistent background
          minHeight: "100vh"
        }}
      >
        {/* Topbar can also be fixed or scroll with content */}
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="p-3">
          <Outlet /> {/* Child routes render here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
