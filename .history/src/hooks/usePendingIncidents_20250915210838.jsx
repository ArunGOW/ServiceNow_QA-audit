// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const usePendingIncidents = (currentPage, limit = 10) => {
//   const { user } = useAuth();
//   const [pendingIncidents, setPendingIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//   const fetchData = async () => {
//     if (!user?.user_sid) {
//       console.warn("⚠️ No user_sid found, skipping fetch.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:8000/api/users/get-pending/incidents/",
//         {
//           user_sid: user.user_sid,
//           page: currentPage,   // ✅ instead of skip
//           per_page: limit,     // ✅ instead of limit
//         }
//       );

//       console.log("📌 Processed API Response:", res.data);

//         setPendingIncidents (Array.isArray(res.data.incidents) ? res.data.incidents : [res.data]);
//       if (res.data.totalCount) {
//         setTotalPages(Math.ceil(res.data.totalCount / limit));
//       }
//     } catch (error) {
//       console.error("❌ Error fetching processed incidents:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [currentPage, user]);


//   return { pendingIncidents, loading, totalPages };
// };

// export default usePendingIncidents;


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
//         const skip = (currentPage - 1) * limit;

//         const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
//           user_sid: user.user_sid,
//           skip,
//           limit,
//         });

//         console.log("📌 Pending API Response:", res.data);

         

//         if (res.data?.totalCount) {
//           setTotalPages(Math.ceil(res.data.totalCount / limit));
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
//             user_sid: user.user_sid,
//             page: currentPage,   // backend expects page
//             per_page: limit,     // backend expects per_page
//           }
//         );

//         console.log("📌 Pending API Response:", res.data);

//         // Ensure incidents is always an array
//         const incidents = Array.isArray(res.data.incidents)
//           ? res.data.incidents
//           : res.data.incidents
//           ? [res.data.incidents]
//           : [];

//         setPendingIncidents(incidents);

//         // Backend sends total_count
//         if (res.data.total_count) {
//           setTotalPages(Math.ceil(res.data.total_count / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching pending incidents:", error);
//         setPendingIncidents([]); // reset on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage, user, limit]);

//   return { pendingIncidents, loading, totalPages };
// };

// export default usePendingIncidents;


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
//             user_sid: user.user_sid,
//             page: currentPage,
//             per_page: limit,
//           }
//         );

//         console.log("📌 Full Pending API Response:", res.data);

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
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const usePendingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user?.user_sid) return;

      setLoading(true); // overlay spinner, keep table visible
      try {
        const res = await axios.post(
          "http://localhost:8000/api/users/get-pending/incidents/",
          {
            user_sid: user.user_sid,
            page: currentPage,
            per_page: limit,
          }
        );

        if (!isMounted) return;

        setPendingIncidents(res.data.response || []);
        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / limit));
        }
      } catch (err) {
        console.error("❌ Error fetching incidents", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentPage, user]);

  return { pendingIncidents, loading, totalPages };
};

export default usePendingIncidents;
