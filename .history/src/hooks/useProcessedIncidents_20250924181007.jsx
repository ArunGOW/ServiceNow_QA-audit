//  import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const useProcessedIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [processedIncidents, setProcessedIncidents] = useState([]);
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
//         const res = await axios.post(
//           "http://localhost:8000/api/users/get-processed/incidents/",
//           {
//             user_sid: user.user_sid,
//             page: currentPage,
//             per_page: limit,
//           }
//         );

//         console.log("📌 Processed API Response:", res.data);

//         // ✅ Use `response` array from backend
//         setProcessedIncidents(Array.isArray(res.data.response) ? res.data.response : []);

//         // ✅ Calculate total pages
//         if (res.data.total) {
//           setTotalPages(Math.ceil(res.data.total / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching processed incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { processedIncidents, loading, totalPages };
// };

// export default useProcessedIncidents;


import { useState, useEffect } from "react";
import api from "../api/axois";
import { useAuth } from "../context/AuthContext";

const useProcessedIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [processedIncidents, setProcessedIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
      if (!user) return;
    if (!user?.user_sid) {
      console.warn("⚠️ No user_sid found, skipping fetch.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.post(
          "http://localhost:8000/api/users/get-processed/incidents/",
          {
            user_sid: user.user_sid,
            page: currentPage,
            per_page: limit,
          }
        );

        console.log("📌 Processed API Response:", res.data);

        // ✅ Safely handle response array
        setProcessedIncidents(
          Array.isArray(res.data.response) ? res.data.response : []
        );

        // ✅ Calculate total pages
        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / limit));
        }
      } catch (error) {
        console.error("❌ Error fetching processed incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user, limit]);); // ✅ Depend directly on `user?.user_sid`

  return { processedIncidents, loading, totalPages };
};

export default useProcessedIncidents;
