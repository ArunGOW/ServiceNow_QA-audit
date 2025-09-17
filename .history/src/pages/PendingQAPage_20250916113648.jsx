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

// PendingQAPage.jsx
import React, { useState } from "react";
import usePendingIncidents from "../hooks/usePendingIncidents";
import PendingQATable from "../components/tables/PendingQATable";
import { Spinner } from "react-bootstrap";

const PendingQAPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { pendingIncidents, loading, totalPages } = usePendingIncidents(currentPage, 10);

  return (
    <div>
      <PendingQATable incidents={pendingIncidents} loading={loading} />

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <span>Page {currentPage} of {totalPages}</span>
        )}

        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingQAPage;

