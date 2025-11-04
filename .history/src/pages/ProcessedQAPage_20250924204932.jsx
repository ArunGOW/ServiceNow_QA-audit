 

// import { useState } from "react";
// import useProcessedIncidents from "../hooks/useProcessedIncidents";
// import ProcessedQATable from "../components/tables/ProcessedQATable";
// import PaginationControls from "../components/PaginationControls";

// const ProcessedQAPage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { processedIncidents, loading, totalPages } = useProcessedIncidents(currentPage, 10);

//   return (
//     <>
//       <ProcessedQATable incidents={processedIncidents}  />
//       <div className="d-flex justify-content-center mt-3">
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           handleNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//         />
//       </div>
//     </>
//   );
// };

// export default ProcessedQAPage;
