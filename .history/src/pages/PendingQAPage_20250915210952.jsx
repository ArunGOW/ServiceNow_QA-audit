//  import React, { useState } from "react";
// import usePendingIncidents from "../hooks/usePendingIncidents";
// import PendingQATable from "../components/tables/PendingQATable";
// import PaginationControls from "../components/PaginationControls";

// const PendingQAPage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { pendingIncidents, loading, totalPages } = usePendingIncidents(currentPage, 10);

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* ✅ Keep table always mounted to avoid flicker */}
//       <div className="min-h-[300px]">
//         <PendingQATable incidents={pendingIncidents} loading={loading} />
//       </div>

//       {/* 🔢 Pagination Controls */}
//          <div className="d-flex justify-content-center mt-3">
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           handleNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//         />
//       </div>
//     </div>
//   );
// };

// export default PendingQAPage;


// src/pages/PendingQAPage.jsx
import { useState } from "react";
import usePendingIncidents from "../hooks/usePendingIncidents";
import PendingQATable from "../components/tables/PendingQATable";

const PendingQAPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { pendingIncidents, loading, totalPages } = usePendingIncidents(currentPage, 10);

  return (
    <div>
      <PendingQATable incidents={pendingIncidents} loading={loading} />

      {/* 🔢 Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-secondary"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingQAPage;
