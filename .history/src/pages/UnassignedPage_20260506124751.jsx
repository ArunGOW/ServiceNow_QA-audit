 import { useState } from "react";
import useUnassignedIncidents from "../hooks/useUnassignedIncidents";
import UnassignedTable from "../components/tables/UnassignedTable";
import PaginationControls from "../components/PaginationControls";

const UnassignedPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Hook handles fetching whenever currentPage changes
  const { unassignedIncidents, loading, totalPages } = useUnassignedIncidents(
    currentPage,
    perPage
  );

  // Single handler for page changes (next, prev, first, last, jump, number click)
  const handlePageChange = (page) => {
    if (page === currentPage || loading) return;
    setCurrentPage(page);
    // Optional: scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <UnassignedTable incidents={unassignedIncidents} loading={loading} />

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
            showJumpTo={true}
            siblingCount={2}
          />
        </div>
      )}
    </>
  );
};

export default UnassignedPage;