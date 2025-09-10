import React from "react";
import CustomButton from "./CustomButton";

const PaginationControls = ({ currentPage, totalPages, handlePrevious, handleNext }) => {
  return (
   
<div className="d-flex justify-content-center align-items-center mt-3 pt-3 border-top">
  <CustomButton
    variant="outline-primary"
    disabled={currentPage === 1}
    onClick={handlePrevious}
    className="me-3"
  >
    ⬅️ Previous
  </CustomButton>

  <span className="fw-semibold text-dark">
    {currentPage} / {totalPages}
  </span>

  <CustomButton
    variant="outline-primary"
    disabled={currentPage === totalPages}
    onClick={handleNext}
    className="ms-3"
  >
    Next ➡️
  </CustomButton>
</div>

  );
};

export default PaginationControls;
