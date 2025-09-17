 

// src/components/PaginationControls.jsx
import { Button } from "react-bootstrap";

const PaginationControls = ({ currentPage, totalPages, handlePrevious, handleNext }) => {
  return (
    <div className="d-flex justify-content-center gap-2 mt-3">
      <Button
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
      </Button>
    </div>
  );
};

export default PaginationControls;

