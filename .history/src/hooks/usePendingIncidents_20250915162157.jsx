import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const usePendingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_sid) {
        console.warn("⚠️ No user_sid found, skipping fetch.");
        return;
      }

      setLoading(true);
      try {
        const skip = (currentPage - 1) * limit;

        const res = await axios.post("http://localhost:8000/api/users/get-pending/incidents", {
          user_sid: user.user_sid,
          skip,
          limit,
        });

        console.log("📌 Pending API Response:", res.data);

        setPendingIncidents(res?.data);

        if (res.data?.totalCount) {
          setTotalPages(Math.ceil(res.data.totalCount / limit));
        }
      } catch (error) {
        console.error("❌ Error fetching pending incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user, limit]);

  return { pendingIncidents, loading, totalPages };
};

export default usePendingIncidents;


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


     