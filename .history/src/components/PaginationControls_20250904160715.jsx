import React from "react";
import { Button } from "react-bootstrap";

const PaginationControls = ({ currentPage, totalPages, handlePrevious, handleNext }) => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-3 pt-3 border-top">
      <Button
        variant="outline-primary"
        disabled={currentPage === 1}
        onClick={handlePrevious}
        className="me-3"
      >
        ⬅️ Previous
      </Button>

      <span className="fw-semibold text-dark">
        {currentPage} / {totalPages}
      </span>

      <Button
        variant="outline-primary"
        disabled={currentPage === totalPages}
        onClick={handleNext}
        className="ms-3"
      >
        Next ➡️
      </Button>
    </div>
  );
};

export default PaginationControls;
