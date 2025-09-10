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

import { useState } from "react";
import useIncidents from "../hooks/useIncidents";
import PendingQATable from "../components/tables/PendingQATable";
import PaginationControls from "../components/PaginationControls";

const PendingQAPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { pendingIncidents, loading, totalPages } = useIncidents(currentPage);

  return (
    <>
      <PendingQATable incidents={pendingIncidents} loading={loading} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        handlePrevious={() => setCurrentPage(p => Math.max(p - 1, 1))}
        handleNext={() => setCurrentPage(p => p + 1)}
      />
    </>
  );
};

export default PendingQAPage;
