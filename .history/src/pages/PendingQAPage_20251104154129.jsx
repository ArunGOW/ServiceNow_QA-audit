 

import React, { useState } from "react";
import usePendingIncidents from "../hooks/usePendingIncidents";
import PendingQATable from "../components/tables/PendingQATable";
import PaginationControls from "../components/PaginationControls";

const PendingQAPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { pendingIncidents, loading, totalPages, refresh } = usePendingIncidents(currentPage, 10);

  return (
    <div>
      {/* ✅ Pass refresh, loading, and data properly */}
      <PendingQATable
        incidents={pendingIncidents}
        loading={loading}
        refresh={refresh}
      />

      <div className="d-flex justify-content-center mt-3">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          handleNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          loading={loading}
          refresh={refresh}
        />
      </div>
    </div>
  );
};

export default PendingQAPage;






