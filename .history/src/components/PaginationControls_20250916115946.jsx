 

// src/components/PaginationControls.jsx
import { Button } from "react-bootstrap";

const PaginationControls = ({ currentPage, totalPages, handlePrevious, handleNext,loading }) => {
  return (
    // <div className="d-flex justify-content-center gap-2 mt-3">
    //   <Button
    //     variant="outline-primary"
    //     onClick={handlePrevious}
    //     disabled={currentPage === 1}
    //   >
    //     Previous
    //   </Button>
    //   <span className="align-self-center">
    //     Page {currentPage} of {totalPages}
    //   </span>
    //   <Button
    //     variant="outline-primary"
    //     onClick={handleNext}
    //     disabled={currentPage === totalPages}
    //   >
    //     Next
    //   </Button>
    // </div>
    <div className="d-flex justify-content-between align-items-center mt-3">
  <Button
    variant="secondary"
    onClick={() => handlePrevious()}
    disabled={currentPage === 1 || loading}
  >
    Previous
  </Button>

  <div className="d-flex align-items-center gap-2">
    <span>
      Page {currentPage} of {totalPages}
    </span>
    {loading && <Spinner animation="border" size="sm" />}
  </div>

  <Button
    variant="secondary"
    onClick={() => handleNext()}
    disabled={currentPage === totalPages || loading}
  >
    Next
  </Button>
</div>

  );
};

export default PaginationControls;

