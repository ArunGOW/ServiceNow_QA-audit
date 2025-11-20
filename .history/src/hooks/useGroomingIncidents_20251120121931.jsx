// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axois";
// import logger from "../utils/logger";

// const useGroomingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [groomingIncidents, setGroomingIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.user_sid) {
//         logger.warn("⚠️ No user_sid found, skipping fetch.");
//         return;
//       }

//       setLoading(true);
//       try {
//         const res = await api.post(
//           "/users/user/grooming-needed",
//           {
//             user_sid: user.user_sid,
//             page: currentPage,
//             per_page: limit,
//           }
//         );

//         logger.info("📌 Grooming API Response:", res.data);

//         // ✅ Assume data is inside response array
//         setGroomingIncidents(Array.isArray(res.data.response) ? res.data.response : []);

//         // ✅ Calculate total pages if available
//         if (res.data.total) {
//           setTotalPages(Math.ceil(res.data.total / limit));
//         }
//       } catch (error) {
//         logger.error("❌ Error fetching grooming incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { groomingIncidents, loading, totalPages };
// };

// export default useGroomingIncidents;


//logger added code 

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axois";
// import logger from "../utils/logger"; // <-- Import logger

// const useGroomingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [groomingIncidents, setGroomingIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.user_sid) {
//         logger.warn("No user_sid found — skipping grooming incidents fetch.");
//         return;
//       }

//       logger.info("Fetching grooming incidents...", {
//         user_sid: user.user_sid,
//         page: currentPage,
//         per_page: limit,
//       });

//       setLoading(true);

//       try {
//         const res = await api.post("/users/user/grooming-needed", {
//           user_sid: user.user_sid,
//           page: currentPage,
//           per_page: limit,
//         });

//         logger.info("Grooming API Response:", res.data);

//         // Set response data
//         setGroomingIncidents(
//           Array.isArray(res.data.response) ? res.data.response : []
//         );

//         // Calculate total pages
//         if (res.data.total) {
//           const pages = Math.ceil(res.data.total / limit);
//           setTotalPages(pages);

//           logger.info(`Total grooming pages: ${pages}`);
//         }
//       } catch (error) {
//         logger.error("Error fetching grooming incidents:", error);
//       } finally {
//         setLoading(false);
//         logger.info("Grooming incidents fetch complete");
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { groomingIncidents, loading, totalPages };
// };

// export default useGroomingIncidents;


 



 import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import api from "../api/axois";
import logger from "../utils/logger";

const useGroomingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [groomingIncidents, setGroomingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    if (!user?.user_sid) {
      logger.warn("⚠️ No user_sid found, skipping fetch.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/users/user/grooming-needed", {
        user_sid: user.user_sid,
        page: currentPage,
        per_page: limit,
      });

      logger.info("📌 Grooming API Response:", res.data);

      setGroomingIncidents(
        Array.isArray(res.data.response) ? res.data.response : []
      );

      if (res.data.total) {
        setTotalPages(Math.ceil(res.data.total / limit));
      }
    } catch (error) {
      logger.error("❌ Error fetching grooming incidents:", error);
    } finally {
      setLoading(false);
    }
  }, [user, currentPage, limit]);

  // Run on mount & when page change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔄 Expose refresh
  const refresh = () => {
    fetchData();
  };

  return { groomingIncidents, loading, totalPages, refresh };
};

export default useGroomingIncidents;
