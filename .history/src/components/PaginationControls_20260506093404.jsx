

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

// import { Spinner } from "react-bootstrap";
// import { ChevronLeft, ChevronRight } from "lucide-react"; // Optional: Use an icon library
// import "./PaginationControls.css";

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   handlePrevious,
//   handleNext,
//   loading,
// }) => {
//   return (
//     <div className="pagination-wrapper">
//       {/* Previous Button */}
//       <button
//         onClick={handlePrevious}
//         disabled={currentPage === 1 || loading}
//         className="pagination-btn"
//         aria-label="Previous Page"
//       >
//         <ChevronLeft size={18} />
//         <span className="d-none d-md-inline">Previous</span>
//       </button>

//       {/* Page Indicator */}
//       <div className="pagination-info">
//         {loading ? (
//           <div className="pagination-loader">
//             <Spinner animation="grow" size="sm" variant="primary" className="me-2" />
//             <span className="loading-text">Updating...</span>
//           </div>
//         ) : (
//           <div className="page-numbers">
//             <span className="current-page">{currentPage}</span>
//             <span className="divider">/</span>
//             <span className="total-pages">{totalPages || 1}</span>
//           </div>
//         )}
//       </div>

//       {/* Next Button */}
//       <button
//         onClick={handleNext}
//         disabled={currentPage === totalPages || loading}
//         className="pagination-btn"
//         aria-label="Next Page"
//       >
//         <span className="d-none d-md-inline">Next</span>
//         <ChevronRight size={18} />
//       </button>
//     </div>
//   );
// };

// export default PaginationControls;


import { useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import "./PaginationControls.css";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,        // unified handler: (page) => void
  loading = false,
  showJumpTo = true,   // toggle "Go to" input
  siblingCount = 2,    // pages shown on each side of current
}) => {
  const [jumpValue, setJumpValue] = useState("");

  const safeTotalPages = Math.max(totalPages || 1, 1);

  // Build the array of page numbers + ellipsis
  const getPages = () => {
    if (safeTotalPages <= 9) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const left = currentPage - siblingCount;
    const right = currentPage + siblingCount;

    pages.push(1);
    if (left > 2) pages.push("…");

    for (
      let i = Math.max(2, left);
      i <= Math.min(safeTotalPages - 1, right);
      i++
    ) {
      pages.push(i);
    }

    if (right < safeTotalPages - 1) pages.push("…");
    pages.push(safeTotalPages);

    return pages;
  };

  const handleChange = (page) => {
    if (loading) return;
    if (page < 1 || page > safeTotalPages || page === currentPage) return;
    onPageChange(page);
  };

  const handleJumpKeyDown = (e) => {
    if (e.key === "Enter") {
      const v = parseInt(jumpValue, 10);
      if (v >= 1 && v <= safeTotalPages) {
        handleChange(v);
        setJumpValue("");
      }
    }
  };

  const isFirst = currentPage === 1;
  const isLast = currentPage >= safeTotalPages;

  return (
    <div className="pagination-wrapper">
      {/* First Page */}
      <button
        onClick={() => handleChange(1)}
        disabled={isFirst || loading}
        className="pagination-btn pagination-icon-btn"
        aria-label="First Page"
        title="First"
      >
        <ChevronsLeft size={18} />
      </button>

      {/* Previous */}
      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={isFirst || loading}
        className="pagination-btn pagination-icon-btn"
        aria-label="Previous Page"
        title="Previous"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers / Loader */}
      <div className="pagination-info">
        {loading ? (
          <div className="pagination-loader">
            <Spinner
              animation="grow"
              size="sm"
              variant="primary"
              className="me-2"
            />
            <span className="loading-text">Updating...</span>
          </div>
        ) : (
          <div className="page-numbers">
            {getPages().map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => handleChange(p)}
                  className={`pagination-num-btn ${
                    p === currentPage ? "active" : ""
                  }`}
                  aria-label={`Page ${p}`}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={isLast || loading}
        className="pagination-btn pagination-icon-btn"
        aria-label="Next Page"
        title="Next"
      >
        <ChevronRight size={18} />
      </button>

      {/* Last Page */}
      <button
        onClick={() => handleChange(safeTotalPages)}
        disabled={isLast || loading}
        className="pagination-btn pagination-icon-btn"
        aria-label="Last Page"
        title="Last"
      >
        <ChevronsRight size={18} />
      </button>

      {/* Jump To Page */}
      {showJumpTo && safeTotalPages > 9 && (
        <div className="pagination-jump">
          <span className="pagination-jump-label">Go to</span>
          <input
            type="number"
            min={1}
            max={safeTotalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={handleJumpKeyDown}
            className="pagination-jump-input"
            placeholder="—"
            disabled={loading}
          />
          <span className="pagination-jump-label">/ {safeTotalPages}</span>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;