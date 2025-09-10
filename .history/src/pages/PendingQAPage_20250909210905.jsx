// // src/pages/PendingQAPage.jsx
// import{ useState, useEffect } from "react";
// import axios from "axios";
// import PendingQATable from "../components/tables/PendingQATable";
// import PaginationControls from "../components/PaginationControls";

// const PendingQAPage = () => {
//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const limit = 10;

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const skip = (currentPage - 1) * limit;
//         const res = await axios.post(
//           "http://localhost:8000/api/users/get/incidents",
//           { skip, limit }
//         );
//         setIncidents(res.data.pending || []); // ✅ using pending key from backend
//       } catch (error) {
//         console.error("Error fetching pending incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [currentPage]);

//   return (
//     <div className="p-3">
//       <h5 className="fw-bold mb-3">Pending QA Incidents</h5>
//       <PendingQATable incidents={incidents} loading={loading} />
//       <div className="d-flex justify-content-center mt-3">
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={20}
//           handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           handleNext={() => setCurrentPage((p) => p + 1)}
//         />
//       </div>
//     </div>
//   );
// };

// export default PendingQAPage;

import axios from "axios";
import { useEffect } from "react";

const PendingQA = () => {
//   useEffect(() => {
//     const fetchIncidents = async () => {
//       try {
//         console.log("Sending request to API...");
//         const res = await axios.post(
//           "http://127.0.0.1:8000/api/users/get/incidents",
//           {
//             skip: 0,
//             limit: 10,
//             // 👇 Try adding required fields if your backend needs them
//             status: "pending",
//           }
//         );
//         console.log("✅ API Response:", res.data);
//       } catch (err) {
//         if (err.response) {
//           console.error("❌ API Error Response:", err.response.data);
//           console.error("❌ Status Code:", err.response.status);
//         } else {
//           console.error("❌ Request Error:", err.message);
//         }
//       }
//     };

//     fetchIncidents();
//   }, []);
const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_sid) {
        console.warn("⚠️ No user_sid found, skipping fetch.");
        return;
      }

      setLoading(true);
      try {
        const skip = (currentPage - 1) * limit;

        // ✅ Send skip, limit, and user_sid in POST body (NOT query string)
        const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
          user_sid: user.user_sid,
          skip,
          limit,
        });

        console.log("📌 API Response:", res.data);

        const allIncidents = res.data?.incidents || [];

        setPendingIncidents(allIncidents.filter((i) => i.audit_status === "Pending"));
        setProcessedIncidents(allIncidents.filter((i) => i.audit_status === "Completed"));

        if (res.data?.totalCount) {
          setTotalPages(Math.ceil(res.data.totalCount / limit));
        }
      } catch (error) {
        console.error("❌ Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user]);

  return (
    <div>
      <h2>Pending QA</h2>
    </div>
  );
};

export default PendingQA;
