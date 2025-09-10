// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const useIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();

//   const [pendingIncidents, setPendingIncidents] = useState([]);
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
//         const skip = (currentPage - 1) * limit;

//         // ✅ API call with required body params
//         const res = await axios.post("http://127.0.0.1:8000/api/users/get/incidents", {
//           user_sid: user.user_sid,
//           skip,
//           limit,
//         });

//         console.log("📌 API Response:", res.data);

//         const allIncidents = res.data?.incidents || [];

//         setPendingIncidents(allIncidents.filter(i => i.audit_status === "Pending"));
//         setProcessedIncidents(allIncidents.filter(i => i.audit_status === "Completed"));

//         if (res.data?.totalCount) {
//           setTotalPages(Math.ceil(res.data.totalCount / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { pendingIncidents, processedIncidents, loading, totalPages };

// };

// export default useIncidents;


import { useState, useEffect } from "react";
import axios from "axios";

export default function useIncidents(user, currentPage, limit) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.user_sid) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * limit;

        const res = await axios.post("http://127.0.0.1:8000/api/users/get/incidents", {
          user_sid: user.user_sid,
          skip,
          limit,
        });

        console.log("✅ useIncidents API data:", res.data);

        setIncidents(res.data?.incidents || []);
      } catch (err) {
        console.error("❌ useIncidents error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, currentPage, limit]);

  return { incidents, loading };
}
