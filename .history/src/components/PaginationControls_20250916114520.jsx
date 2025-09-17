 

// src/components/PaginationControls.jsx
import { Button } from "react-bootstrap";

const PaginationControls = ({ currentPage, totalPages, handlePrevious, handleNext }) => {
  return (
    <div className="d-flex justify-content-center gap-2 mt-3">
      {/* <Button
        variant="outline-primary"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="align-self-center">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline-primary"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </Button> */}
      
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
  );
};

export default PaginationControls;

