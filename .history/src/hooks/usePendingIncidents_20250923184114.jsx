 


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const usePendingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [pendingIncidents, setPendingIncidents] = useState([]);
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
//           "http://localhost:8000/api/users/get-pending/incidents/",
//           {
//             user_sid:user.user_sid,
//             page: currentPage,
//             per_page: limit,
//           }
//         );

//         console.log("📌 Pending API Response:", res.data);

//         // ✅ Use `response` key from backend
//         setPendingIncidents(Array.isArray(res.data.response) ? res.data.response : []);

//         // ✅ Calculate total pages using `total`
//         if (res.data.total) {
//           setTotalPages(Math.ceil(res.data.total / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching pending incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { pendingIncidents, loading, totalPages };
// };

// export default usePendingIncidents;


// src/hooks/usePendingIncidents.js
// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axois";   // ✅ use centralized axios instance

// const usePendingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [pendingIncidents, setPendingIncidents] = useState([]);
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
//         const res = await api.post("/users/get-pending/incidents/", {
//           user_sid: user.user_sid,
//           page: currentPage,
//           per_page: limit,
//         });

//         console.log("📌 Pending API Response:", res.data);

//         // ✅ Adjust if backend wraps data differently
//         setPendingIncidents(Array.isArray(res.data.response) ? res.data.response : []);

//         if (res.data.total) {
//           setTotalPages(Math.ceil(res.data.total / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching pending incidents:", error.response?.data || error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { pendingIncidents, loading, totalPages };
// };

// export default usePendingIncidents;

// src/hooks/usePendingIncidents.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axois";

const usePendingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPendingIncidents = async () => {
      if (!user?.user_sid) {
        console.warn("⚠️ No user_sid found, skipping fetch.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.post("/users/get-pending/incidents/", {
          user_sid: user.user_sid,
          page: currentPage,
          per_page: limit,
        });

        console.log("📌 Pending API Response:", res.data);

        setPendingIncidents(Array.isArray(res.data.response) ? res.data.response : []);

        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / limit));
        }
      } catch (error) {
        console.error("❌ Error fetching pending incidents:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingIncidents();
  }, [currentPage, user, limit]);

  return { pendingIncidents, loading, totalPages };
};

export default usePendingIncidents;

