 

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




import { useState, useEffect } from "react";
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";
import logger from "../utils/logger";

const useProcessedIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();

  const [processedIncidents, setProcessedIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) return;

    if (!user?.user_sid) {
      logger.warn("User SID missing. Skipping processed incidents fetch.");
      return;
    }

    const fetchData = async () => {
      logger.info("Fetching processed incidents request", {
        page: currentPage,
        limit,
        user_sid: user.user_sid,
      });

      setLoading(true);

      try {
        const res = await api.post("/users/get-processed/incidents/", {
          user_sid: user.user_sid,
          page: currentPage,
          per_page: limit,
        });

        logger.info("Processed incidents API response:", res.data);

        const responseList = Array.isArray(res.data.response)
          ? res.data.response
          : [];

        setProcessedIncidents(responseList);

        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / limit));
        }
      } catch (error) {
        logger.error("Error fetching processed incidents:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user, limit]);

  return { processedIncidents, loading, totalPages };
};

export default useProcessedIncidents;

