// // src/pages/ProcessedQAPage.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import ProcessedQATable from "../components/tables/ProcessedQATable";
// import PaginationControls from "../components/PaginationControls";

// const ProcessedQAPage = () => {
//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 10;

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const skip = (currentPage - 1) * limit;
//         const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
//           skip,
//           limit,
//         });

//         // Ensure backend response has these keys:
//         setIncidents(res.data.processed || []);

//         // ✅ Dynamically calculate total pages
//         if (res.data.total_count) {
//           setTotalPages(Math.ceil(res.data.total_count / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching processed incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [currentPage]);

//   return (
//     <>
//       <ProcessedQATable incidents={incidents} loading={loading} />
//       <div className="d-flex justify-content-center mt-3">
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           handleNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//         />
//       </div>
//     </>
//   );
// };

// export default ProcessedQAPage;

 import React, { useState } from "react";
import useProcessedIncidents from "../hooks/useProcessedIncidents";
import ProcessedQATable from "../components/tables/ProcessedQATable";

const ProcessedQAPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { processedIncidents, loading, totalPages } = useProcessedIncidents(currentPage, 10);

  return (
    <div>
      <h2>Processed QA</h2>
      <ProcessedQATable incidents={processedIncidents} loading={loading} />
    </div>
  );
};

export default ProcessedQAPage;

