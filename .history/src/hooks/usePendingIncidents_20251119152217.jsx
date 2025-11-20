

// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axois";

// const usePendingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchData = useCallback(async () => {
//     if (!user?.user_sid) return;

//     setLoading(true);
//     try {
//       const res = await api.post("/users/get-pending/incidents/", {
//         user_sid: user.user_sid,
//         page: currentPage,
//         per_page: limit,
//       });

//       const responseData = Array.isArray(res.data.response)
//         ? res.data.response
//         : [];

//       setPendingIncidents(responseData);
//       if (res.data.total) {
//         setTotalPages(Math.ceil(res.data.total / limit));
//       }
//     } catch (error) {
//       console.error("❌ Error fetching pending incidents:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, user, limit]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { pendingIncidents, loading, totalPages, refresh: fetchData };
// };

// export default usePendingIncidents;

// logger added code



import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axois";
import logger from "../utils/logger"; // <-- logger added

const usePendingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    if (!user?.user_sid) {
      logger.warn("No user_sid found — skipping pending incidents fetch.");
      return;
    }

    logger.info("Fetching pending incidents...", {
      user_sid: user.user_sid,
      page: currentPage,
      per_page: limit,
    });

    setLoading(true);

    try {
      const res = await api.post("/users/get-pending/incidents/", {
        user_sid: user.user_sid,
        page: currentPage,
        per_page: limit,
      });

      logger.info("Pending Incidents API Response:", res.data);

      const responseData = Array.isArray(res.data.response)
        ? res.data.response
        : [];

      setPendingIncidents(responseData);

      if (res.data.total) {
        const pages = Math.ceil(res.data.total / limit);
        setTotalPages(pages);

        logger.info(`Total pending incidents pages: ${pages}`);
      }
    } catch (error) {
      logger.error("Error fetching pending incidents:", {
        message: error.message,
        backend: error.response?.data,
      });
    } finally {
      setLoading(false);
      logger.info("Pending incidents fetch completed");
    }
  }, [currentPage, user, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { pendingIncidents, loading, totalPages, refresh: fetchData };
};

export default usePendingIncidents;


