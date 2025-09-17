import { useState } from "react";
import useUnassignedIncidents from "../hooks/useUnassignedIncidents";
import UnassignedTable from "../components/tables/UnassignedTable";
import PaginationControls from "../components/PaginationControls";

const UnassignedPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { unassignedIncidents, loading, totalPages } = useUnassignedIncidents(currentPage, 10);

  return (
    <>
      <UnassignedTable incidents={unassignedIncidents} loading={loading} />
      <div className="d-flex justify-content-center mt-3">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          handleNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        />
      </div>
    </>
  );
};

export default UnassignedPage;
