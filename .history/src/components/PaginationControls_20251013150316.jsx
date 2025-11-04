 

// src/components/PaginationControls.jsx
// import { Button } from "react-bootstrap";

// const PaginationControls = ({ currentPage, totalPages, handlePrevious, handleNext,loading }) => {
//   return (
//     // <div className="d-flex justify-content-center gap-2 mt-3">
//     //   <Button
//     //     variant="outline-primary"
//     //     onClick={handlePrevious}
//     //     disabled={currentPage === 1}
//     //   >
//     //     Previous
//     //   </Button>
//     //   <span className="align-self-center">
//     //     Page {currentPage} of {totalPages}
//     //   </span>
//     //   <Button
//     //     variant="outline-primary"
//     //     onClick={handleNext}
//     //     disabled={currentPage === totalPages}
//     //   >
//     //     Next
//     //   </Button>
//     // </div>
//     <div className="d-flex justify-content-between align-items-center mt-3">
//   <Button
//     variant="secondary"
//     onClick={() => handlePrevious()}
//     disabled={currentPage === 1 || loading}
//   >
//     Previous
//   </Button>

//   <div className="d-flex align-items-center gap-2">
//     <span>
//       Page {currentPage} of {totalPages}
//     </span>
//     {loading && <Spinner animation="border" size="sm" />}
//   </div>

//   <Button
//     variant="secondary"
//     onClick={() => handleNext()}
//     disabled={currentPage === totalPages || loading}
//   >
//     Next
//   </Button>
// </div>

//   );
// };

// export default PaginationControls;


// import { Button, Spinner } from "react-bootstrap";

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   handlePrevious,
//   handleNext,
//   loading,   // 👈 add this
// }) => {
//   return (
//     <div className="d-flex justify-content-between align-items-center mt-3">
//       <Button
//         variant="primary"
//         onClick={handlePrevious}
//         disabled={currentPage === 1 || loading}
//       >
//         Previous
//       </Button>

//       <div className="d-flex align-items-center gap-2">
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         {/* {loading && <Spinner animation="border" size="sm" />} */}
//       </div>

//       <Button
//         variant="primary"
//         onClick={handleNext}
//         disabled={currentPage === totalPages || loading}
//       >
//         Next
//       </Button>
//     </div>
//   );
// };

// export default PaginationControls;





// src/components/PaginationControls.jsx
// import { Pagination, Spinner } from "react-bootstrap";

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   handlePrevious,
//   handleNext,
//   loading,
// }) => {
//   return (
//     <div className="d-flex justify-content-between align-items-center mt-4">
//       {/* Previous Button */}
//       <Pagination className="mb-0">
//         <Pagination.Prev
//           onClick={handlePrevious}
//           disabled={currentPage === 1 || loading}
//         >
//           Previous
//         </Pagination.Prev>
//       </Pagination>

//       {/* Page Info in Center */}
//       <div className="d-flex align-items-center gap-2 fw-semibold">
//         <span>
//           Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
//         </span>
//         {/* {loading && <Spinner animation="border" size="sm" />} */}
//       </div>

//       {/* Next Button */}
//       <Pagination className="mb-0">
//         <Pagination.Next
//           onClick={handleNext}
//           disabled={currentPage === totalPages || loading}
//         >
//           Next
//         </Pagination.Next>
//       </Pagination>
//     </div>
//   );
// };

// export default PaginationControls;


import { Pagination, Spinner } from "react-bootstrap";
import "../PaginationControls.css"

const PaginationControls = ({
  currentPage,
  totalPages,
  handlePrevious,
  handleNext,
  loading,
}) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center mt-4 px-3 py-2 
      border rounded shadow-sm bg-light flex-wrap"
      style={{ minHeight: "60px" }}
    >
      {/* Previous Button */}
      <Pagination className="mb-0">
        <Pagination.Prev
          onClick={handlePrevious}
          disabled={currentPage === 1 || loading}
          className={`px-3 py-1 fw-semibold ${
            currentPage === 1 ? "opacity-50" : "hover-scale"
          }`}
        >
          ← Previous
        </Pagination.Prev>
      </Pagination>

      {/* Page Info Center */}
      <div
        className="d-flex align-items-center gap-2 fw-semibold text-secondary"
        style={{ fontSize: "0.95rem" }}
      >
        <span>
          Page{" "}
          <span className="text-primary fw-bold">{currentPage}</span> of{" "}
          <span className="text-dark fw-bold">{totalPages}</span>
        </span>

        {loading && (
          <Spinner
            animation="border"
            size="sm"
            variant="primary"
            className="ms-2"
          />
        )}
      </div>

      {/* Next Button */}
      <Pagination className="mb-0">
        <Pagination.Next
          onClick={handleNext}
          disabled={currentPage === totalPages || loading}
          className={`px-3 py-1 fw-semibold ${
            currentPage === totalPages ? "opacity-50" : "hover-scale"
          }`}
        >
          Next →
        </Pagination.Next>
      </Pagination>
    </div>
  );
};

export default PaginationControls;

