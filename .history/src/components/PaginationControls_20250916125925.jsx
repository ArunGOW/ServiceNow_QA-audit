 

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
import { Pagination, Spinner } from "react-bootstrap";

const PaginationControls = ({
  currentPage,
  totalPages,
  handlePrevious,
  handleNext,
  loading,
}) => {
  // Generate page numbers (basic, can be improved with ellipsis)
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>
        {/* Previous button */}
        <Pagination.Prev
          onClick={handlePrevious}
          disabled={currentPage === 1 || loading}
        />

        {/* Page numbers */}
        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => !loading && page !== currentPage && handleNext(page)}
          >
            {page}
          </Pagination.Item>
        ))}

        {/* Next button */}
        <Pagination.Next
          onClick={handleNext}
          disabled={currentPage === totalPages || loading}
        />
      </Pagination>

      {/* Optional loading spinner */}
      {loading && (
        <div className="d-flex align-items-center ms-3">
          <Spinner animation="border" size="sm" />
        </div>
      )}
    </div>
  );
};

export default PaginationControls;



