import { useState } from "react";
import useUnassignedIncidents from "../hooks/useUnassignedIncidents";
import UnassignedTable from "../components/tables/UnassignedTable";
import PaginationControls from "../components/PaginationControls";

const UnassignedPage = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const { unassignedIncidents, loading, totalPages } = useUnassignedIncidents(currentPage, 10);
    const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalItems = 256;
  const perPage = 10;
  const totalPages = Math.ceil(totalItems / perPage);

  const handlePageChange = async (page) => {
    setLoading(true);
    setCurrentPage(page);
    // fetch data for `page`
    await fetchData(page);
    setLoading(false);
  };

  return (
    <>
      <UnassignedTable incidents={unassignedIncidents} loading={loading} />
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
    </>
  );
};

export default UnassignedPage;
