 import React, { useState } from "react";
import usePendingIncidents from "../hooks/usePendingIncidents";
import PendingQATable from "../components/tables/PendingQATable";

const PendingQAPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { pendingIncidents, loading, totalPages } = usePendingIncidents(currentPage, 10);

  return (
    <div>
      {/* <h2>Pending QA</h2> */}
      <PendingQATable incidents={pendingIncidents} loading={loading} />
    </div>
  );
};

export default PendingQAPage;
