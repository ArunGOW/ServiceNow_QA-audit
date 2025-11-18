 import { useState } from "react";
import useGroomingIncidents from "../hooks/useGroomingIncidents";
import GroomingTable from "../components/tables/GroomingTable";
import PaginationControls from "../components/PaginationControls";

const GroomingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { groomingIncidents, loading, totalPages } = useGroomingIncidents(currentPage, 10);

    // ✅ Add refresh function
  const refresh = () => {
    // Change page temporarily to trigger useEffect
    setCurrentPage((p) => p); // simple force-refresh
  };

  return (
    <>
      <GroomingTable incidents={groomingIncidents} loading={loading} refresh={refresh} />
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

export default GroomingPage;
