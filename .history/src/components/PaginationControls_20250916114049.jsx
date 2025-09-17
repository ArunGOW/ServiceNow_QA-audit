 

// src/components/PaginationControls.jsx
import { Button } from "react-bootstrap";

const PaginationControls = ({ currentPage, totalPages, handlePrevious, handleNext }) => {
  return (
    <div className="flex justify-between items-center mt-4">
  <button
    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
    disabled={currentPage === 1 || loading}
    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <div className="flex items-center gap-2">
    <span>Page {currentPage} of {totalPages}</span>
    {loading && <Spinner animation="border" size="sm" />}
  </div>

  <button
    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
    disabled={currentPage === totalPages || loading}
    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

  );
};

export default PaginationControls;

