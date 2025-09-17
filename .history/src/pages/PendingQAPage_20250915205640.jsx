 import React, { useState } from "react";
import usePendingIncidents from "../hooks/usePendingIncidents";
import PendingQATable from "../components/tables/PendingQATable";

const PendingQAPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { pendingIncidents, loading, totalPages } = usePendingIncidents(currentPage, 10);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4">
      {/* ✅ Keep table always mounted to avoid flicker */}
      <div className="min-h-[300px]">
        <PendingQATable incidents={pendingIncidents} loading={loading} />
      </div>

      {/* 🔢 Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1 || loading}
          className={`px-4 py-2 rounded transition ${
            currentPage === 1 || loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>

        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0 || loading}
          className={`px-4 py-2 rounded transition ${
            currentPage === totalPages || totalPages === 0 || loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingQAPage;
