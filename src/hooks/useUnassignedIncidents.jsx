import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import api from "../api/axois";
import logger from "../utils/logger";

const useUnassignedIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [unassignedIncidents, setUnassignedIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_sid) {
         logger.warn("⚠️ No user_sid found, skipping fetch.");
        return;
      }

      setLoading(true);
      try {
        const res = await api.post(
          "/users/get-unassigned/incidents/",
          {
            user_sid: user.user_sid,
            page: currentPage,
            per_page: limit,
          }
        );

        logger.info("📌 Unassigned API Response:", res.data);

        setUnassignedIncidents(Array.isArray(res.data.response) ? res.data.response : []);

        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / limit));
        }
      } catch (error) {
        logger.error("❌ Error fetching unassigned incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user, limit]);

  return { unassignedIncidents, loading, totalPages };
};

export default useUnassignedIncidents;



// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axois";
// import logger from "../utils/logger";

// const useUnassignedIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [unassignedIncidents, setUnassignedIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.user_sid) {
//         logger.warn("User SID missing. Skipping unassigned incidents fetch.");
//         return;
//       }

//       logger.info("Fetching unassigned incidents...", {
//         page: currentPage,
//         limit,
//         user_sid: user.user_sid,
//       });

//       setLoading(true);

//       try {
//         const res = await api.post("/users/get-unassigned/incidents/", {
//           user_sid: user.user_sid,
//           page: currentPage,
//           per_page: limit,
//         });

//         logger.info("Unassigned incidents API response:", res.data);

//         const data = Array.isArray(res.data.response)
//           ? res.data.response
//           : [];

//         setUnassignedIncidents(data);

//         if (res.data.total) {
//           setTotalPages(Math.ceil(res.data.total / limit));
//         }
//       } catch (error) {
//         logger.error("Error fetching unassigned incidents:", error.response?.data || error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { unassignedIncidents, loading, totalPages };
// };

// export default useUnassignedIncidents;
