// // src/pages/PendingQAPage.jsx
// import{ useState, useEffect } from "react";
// import axios from "axios";
// import PendingQATable from "../components/tables/PendingQATable";
// import PaginationControls from "../components/PaginationControls";

// const PendingQAPage = () => {
//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const limit = 10;

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const skip = (currentPage - 1) * limit;
//         const res = await axios.post(
//           "http://localhost:8000/api/users/get/incidents",
//           { skip, limit }
//         );
//         setIncidents(res.data.pending || []); // ✅ using pending key from backend
//       } catch (error) {
//         console.error("Error fetching pending incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [currentPage]);

//   return (
//     <div className="p-3">
//       <h5 className="fw-bold mb-3">Pending QA Incidents</h5>
//       <PendingQATable incidents={incidents} loading={loading} />
//       <div className="d-flex justify-content-center mt-3">
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={20}
//           handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           handleNext={() => setCurrentPage((p) => p + 1)}
//         />
//       </div>
//     </div>
//   );
// };

// export default PendingQAPage;

// import { useState } from "react";
// import useIncidents from "../hooks/useIncidents";
// import PendingQATable from "../components/tables/PendingQATable";
// import PaginationControls from "../components/PaginationControls";

// const PendingQAPage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { pendingIncidents, loading, totalPages } = useIncidents(currentPage);
//   console.log("pendingIncidents List",pendingIncidents)

//   return (
//     <>
//       <PendingQATable incidents={pendingIncidents} loading={loading} />
//       <PaginationControls
//         currentPage={currentPage}
//         totalPages={totalPages}
//         handlePrevious={() => setCurrentPage(p => Math.max(p - 1, 1))}
//         handleNext={() => setCurrentPage(p => p + 1)}
//       />
//     </>
//   );
// };

// export default PendingQAPage;

import React, { useState } from "react";
import useIncidents from "../hooks/useIncidents";

const PendingQAPage = ({ user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { incidents, loading } = useIncidents(user, currentPage, limit);

  // Filter only pending
  const pendingIncidents = incidents.filter((i) => i.audit_status === "Pending");

  console.log("🟢 Pending incidents in PendingQAPage:", pendingIncidents);

  return (
    <div>
      <h2>Pending QA</h2>

      {loading && <p>Loading...</p>}

      <table>
        <thead>
          <tr>
            <th>Incident #</th>
            <th>Handled By</th>
            <th>Handled On</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pendingIncidents.length > 0 ? (
            pendingIncidents.map((incident, index) => (
              <tr key={incident.id || index}>
                <td>{incident.incident_number || "N/A"}</td>
                <td>{incident.handled_by || "N/A"}</td>
                <td>{incident.handled_on ? new Date(incident.handled_on).toLocaleDateString() : "N/A"}</td>
                <td>{incident.audit_status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No pending incidents found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingQAPage;

