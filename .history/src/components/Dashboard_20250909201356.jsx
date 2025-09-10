//  import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Layout from "./layout/Layout";
// import PendingQATable from "./tables/PendingQATable";
// import ProcessedQATable from "./tables/ProcessedQATable";
// import PaginationControls from "./PaginationControls";
// import { AuthContext } from "../context/AuthContext";

// const Dashboard = () => {
//   const { user } = useContext(AuthContext); // ✅ get user info (user_sid)
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [processedIncidents, setProcessedIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 10;

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.user_sid) {
//         console.warn("⚠️ No user_sid found, skipping fetch.");
//         return;
//       }

//       setLoading(true);
//       try {
//         const skip = (currentPage - 1) * limit;

//         // ✅ Send skip, limit, and user_sid in POST body (NOT query string)
//         const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
//           user_sid: user.user_sid,
//           skip,
//           limit,
//         });

//         console.log("📌 API Response:", res.data);

//         const allIncidents = res.data?.incidents || [];

//         setPendingIncidents(allIncidents.filter((i) => i.audit_status === "Pending"));
//         setProcessedIncidents(allIncidents.filter((i) => i.audit_status === "Completed"));

//         if (res.data?.totalCount) {
//           setTotalPages(Math.ceil(res.data.totalCount / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user]);

//   return (
//     <Layout>
//       <PendingQATable incidents={pendingIncidents} loading={loading} />
//       <ProcessedQATable incidents={processedIncidents} />
//       <div className="d-flex justify-content-center mt-3">
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           handleNext={() => setCurrentPage((p) => p + 1)}
//         />
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;


// // src/components/Dashboard.jsx
// import { Outlet } from "react-router-dom";
// import { useState } from "react";
// import Sidebar from "./layout/Sidebar";
// import Topbar from "./layout/Topbar";

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

// src/pages/Dashboard.jsx
import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import PendingQA from "../pages/PendingQA";
 
import { useState } from "react";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-grow-1">
        <Topbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="p-3">
          <Routes>
            {/* 👇 Default route redirects to Pending QA */}
            <Route index element={<Navigate to="pending-qa" replace />} />

           
            {/* fallback if no match */}
            <Route path="*" element={<PendingQA />} />
          </Routes>

          {/* Outlet is optional if you want nested children */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
