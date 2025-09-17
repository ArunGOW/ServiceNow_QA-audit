// import React from "react";
// import CustomButton from "./CustomButton";

// const PaginationControls = ({ currentPage, totalPages, handlePrevious, handleNext }) => {
//   return (
   
// <div className="d-flex justify-content-center align-items-center mt-3 pt-3 border-top">
//   <CustomButton
//     variant="outline-primary"
//     disabled={currentPage === 1}
//     onClick={handlePrevious}
//     className="me-3"
//   >
//     ⬅️ Previous
//   </CustomButton>

//   <span className="fw-semibold text-dark">
//     {currentPage} / {totalPages}
//   </span>

//   <CustomButton
//     variant="outline-primary"
//     disabled={currentPage === totalPages}
//     onClick={handleNext}
//     className="ms-3"
//   >
//     Next ➡️
//   </CustomButton>
// </div>

//   );
// };

// export default PaginationControls;

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

