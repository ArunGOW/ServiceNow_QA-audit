

// import { Pagination, Spinner } from "react-bootstrap";
//  import "../PaginationControls.css";

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   handlePrevious,
//   handleNext,
//   loading,
// }) => {
//   return (
//     <div
//       className="d-flex justify-content-between align-items-center mt-4 px-3 py-2 
//       border rounded shadow-sm bg-light flex-wrap"
//       style={{ minHeight: "60px" }}
//     >
//       {/* Previous Button */}
//       <Pagination className="mb-0">
//         <Pagination.Prev
//           onClick={handlePrevious}
//           disabled={currentPage === 1 || loading}
//           className={`px-3 py-1 fw-semibold ${
//             currentPage === 1 ? "opacity-50" : "hover-scale"
//           }`}
//         >
//           ← Previous
//         </Pagination.Prev>
//       </Pagination>

//       {/* Page Info Center */}
//       <div
//         className="d-flex align-items-center gap-2 fw-semibold text-secondary"
//         style={{ fontSize: "0.95rem" }}
//       >
//         <span>
//           Page{" "}
//           <span className="text-primary fw-bold">{currentPage}</span> of{" "}
//           <span className="text-dark fw-bold">{totalPages}</span>
//         </span>

//         {loading && (
//           <Spinner
//             animation="border"
//             size="sm"
//             variant="primary"
//             className="ms-2"
//           />
//         )}
//       </div>

//       {/* Next Button */}
//       <Pagination className="mb-0">
//         <Pagination.Next
//           onClick={handleNext}
//           disabled={currentPage === totalPages || loading}
//           className={`px-3 py-1 fw-semibold ${
//             currentPage === totalPages ? "opacity-50" : "hover-scale"
//           }`}
//         >
//           Next →
//         </Pagination.Next>
//       </Pagination>
//     </div>
//   );
// };

// export default PaginationControls;

import { Spinner } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Optional: Use an icon library
import "./PaginationControls.css";

const PaginationControls = ({
  currentPage,
  totalPages,
  handlePrevious,
  handleNext,
  loading,
}) => {
  return (
    <div className="pagination-wrapper">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || loading}
        className="pagination-btn"
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
        <span className="d-none d-md-inline">Previous</span>
      </button>

      {/* Page Indicator */}
      <div className="pagination-info">
        {loading ? (
          <div className="pagination-loader">
            <Spinner animation="grow" size="sm" variant="primary" className="me-2" />
            <span className="loading-text">Updating...</span>
          </div>
        ) : (
          <div className="page-numbers">
            <span className="current-page">{currentPage}</span>
            <span className="divider">/</span>
            <span className="total-pages">{totalPages || 1}</span>
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || loading}
        className="pagination-btn"
        aria-label="Next Page"
      >
        <span className="d-none d-md-inline">Next</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default PaginationControls;