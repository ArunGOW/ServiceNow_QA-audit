 import React, { useState } from "react";
import usePendingIncidents from "../hooks/usePendingIncidents";
import PendingQATable from "../components/tables/PendingQATable";
import PaginationControls from "../components/PaginationControls";

const PendingQAPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { pendingIncidents, loading, totalPages } = usePendingIncidents(currentPage, 10);

  return (
    <div>
      {/* <h2>Pending QA</h2> */}
      <PendingQATable incidents={pendingIncidents} loading={loading} />

      {/* 🔢 Pagination Controls */}
        <div className="d-flex justify-content-center mt-3">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          handleNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        />
      </div>
    </div>
  );
};

export default PendingQAPage;
