 


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


// // src/hooks/usePendingIncidents.js
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
// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axois";

// const usePendingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

  
//   useEffect(() => {
//   if (!user) return; // ⏳ wait until user is set
//   if (!user?.user_sid) {
//     console.warn("⚠️ No user_sid found, skipping fetch.");
//     return;
//   }

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await api.post("/users/get-pending/incidents/", {
//         user_sid: user.user_sid,
//         page: currentPage,
//         per_page: limit,
//       });

//       console.log("📌 Pending API Response:", res.data);
//       setPendingIncidents(Array.isArray(res.data.response) ? res.data.response : []);
//       if (res.data.total) {
//         setTotalPages(Math.ceil(res.data.total / limit));
//       }
//     } catch (error) {
//       console.error("❌ Error fetching pending incidents:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [currentPage, user, limit]);

//   return { pendingIncidents, loading, totalPages };
// };

// export default usePendingIncidents;


// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "../context/AuthContext";
// import api from "../api/axois";

// const usePendingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchData = useCallback(async () => {
//     if (!user) return;
//     if (!user?.user_sid) {
//       console.warn("⚠️ No user_sid found, skipping fetch.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await api.post("/users/get-pending/incidents/", {
//         user_sid: user.user_sid,
//         page: currentPage,
//         per_page: limit,
//       });

//       console.log("📌 Pending API Response:", res.data);
//       setPendingIncidents(Array.isArray(res.data.response) ? res.data.response : []);
//       if (res.data.total) {
//         setTotalPages(Math.ceil(res.data.total / limit));
//       }
//     } catch (error) {
//       console.error("❌ Error fetching pending incidents:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, user, limit]);

//   // auto-fetch when deps change
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { pendingIncidents, loading, totalPages, refresh: fetchData }; // ✅ expose refresh
// };

// export default usePendingIncidents;


// src/hooks/usePendingIncidents.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axois";

const usePendingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch pending incidents
  const fetchData = useCallback(async () => {
    if (!user?.user_sid) return;

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
  }, [currentPage, user, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh helper
  const refresh = async () => {
    await fetchData();
  };

  // Assign an incident (so table auto-refreshes after assign)
  const assignIncident = async (incidentSid, assignedToSid) => {
    if (!user?.user_sid) throw new Error("Logged-in user not found");

    try {
      await api.post("/users/assign-incident/", {
        incident_sid: incidentSid,
        assigned_by_sid: user.user_sid,
        assigned_to_sid: assignedToSid,
      });
      // Refresh the table after successful assign
      await refresh();
      console.log("✅ Incident assigned and table refreshed");
    } catch (error) {
      console.error("❌ Error assigning incident:", error.response?.data || error.message);
      throw error;
    }
  };

  // Update an incident (so table auto-refreshes after update)
  const updateIncident = async (payload) => {
    try {
      await api.post("/users/update/incident-status", payload);
      // Refresh table after update
      await refresh();
      console.log("✅ Incident updated and table refreshed");
    } catch (error) {
      console.error("❌ Error updating incident:", error.response?.data || error.message);
      throw error;
    }
  };

  return {
    pendingIncidents,
    loading,
    totalPages,
    refresh,
    assignIncident,
    updateIncident,
  };
};

export default usePendingIncidents;

