// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axois";

// const useGroomingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [groomingIncidents, setGroomingIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.user_sid) {
//         console.warn("⚠️ No user_sid found, skipping fetch.");
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

//         console.log("📌 Grooming API Response:", res.data);

//         // ✅ Assume data is inside response array
//         setGroomingIncidents(Array.isArray(res.data.response) ? res.data.response : []);

//         // ✅ Calculate total pages if available
//         if (res.data.total) {
//           setTotalPages(Math.ceil(res.data.total / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching grooming incidents:", error);
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


import { useState, useEffect } from "react";
import api from "../api/axois";
import logger from "../utils/logger";
import { useAuth } from "../context/AuthContext";

const useGroomingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const userSid = user?.user_sid; // extract only SID
  const [groomingIncidents, setGroomingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userSid) {
      logger.warn("No user_sid found — skipping grooming incidents fetch.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.post("/users/user/grooming-needed", {
          user_sid: userSid,
          page: currentPage,
          per_page: limit,
        });

        setGroomingIncidents(Array.isArray(res.data.response) ? res.data.response : []);
        setTotalPages(Math.ceil((res.data.total || 1) / limit));
      } catch (error) {
        logger.error("Error fetching grooming incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, userSid, limit]); // <-- only userSid

  return { groomingIncidents, loading, totalPages };
};

export default useGroomingIncidents;



 