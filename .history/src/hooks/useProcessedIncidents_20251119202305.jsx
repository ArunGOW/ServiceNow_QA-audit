 


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
       logger.warn("⚠️ No user_sid found, skipping fetch.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.post(
          "/users/get-processed/incidents/",
          {
            user_sid: user.user_sid,
            page: currentPage,
            per_page: limit,
          }
        );

        logger.info("📌 Processed API Response:", res.data);

        // ✅ Safely handle response array
        setProcessedIncidents(
          Array.isArray(res.data.response) ? res.data.response : []
        );

        // ✅ Calculate total pages
        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / limit));
        }
      } catch (error) {
         logger.error("❌ Error fetching processed incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user, limit]); // ✅ Depend directly on `user?.user_sid`

  return { processedIncidents, loading, totalPages };
};

export default useProcessedIncidents;


// import { useState, useEffect } from "react";
// import api from "../api/axois";
// import { useAuth } from "../context/AuthContext";
// import logger from "../utils/logger";

// const useProcessedIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();

//   const [processedIncidents, setProcessedIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     if (!user) return;

//     if (!user?.user_sid) {
//       logger.warn("User SID missing. Skipping processed incidents fetch.");
//       return;
//     }

//     const fetchData = async () => {
//       logger.info("Fetching processed incidents request", {
//         page: currentPage,
//         limit,
//         user_sid: user.user_sid,
//       });

//       setLoading(true);

//       try {
//         const res = await api.post("/users/get-processed/incidents/", {
//           user_sid: user.user_sid,
//           page: currentPage,
//           per_page: limit,
//         });

//         logger.info("Processed incidents API response:", res.data);

//         const responseList = Array.isArray(res.data.response)
//           ? res.data.response
//           : [];

//         setProcessedIncidents(responseList);

//         if (res.data.total) {
//           setTotalPages(Math.ceil(res.data.total / limit));
//         }
//       } catch (error) {
//         logger.error("Error fetching processed incidents:", error.response?.data || error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { processedIncidents, loading, totalPages };
// };

// export default useProcessedIncidents;
