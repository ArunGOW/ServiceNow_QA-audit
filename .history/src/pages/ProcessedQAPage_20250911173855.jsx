// // src/pages/ProcessedQAPage.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import ProcessedQATable from "../components/tables/ProcessedQATable";
// import PaginationControls from "../components/PaginationControls";

// const ProcessedQAPage = () => {
//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const limit = 10;

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const skip = (currentPage - 1) * limit;
//         const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
//           skip,
//           limit,
//         });

//         // Ensure backend response has these keys:
//         setIncidents(res.data.processed || []);

//         // ✅ Dynamically calculate total pages
//         if (res.data.total_count) {
//           setTotalPages(Math.ceil(res.data.total_count / limit));
//         }
//       } catch (error) {
//         console.error("❌ Error fetching processed incidents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [currentPage]);

//   return (
//     <>
//       <ProcessedQATable incidents={incidents} loading={loading} />
//       <div className="d-flex justify-content-center mt-3">
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//           handleNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//         />
//       </div>
//     </>
//   );
// };

// export default ProcessedQAPage;

//  import React, { useState } from "react";
// import useProcessedIncidents from "../hooks/useProcessedIncidents";
// import ProcessedQATable from "../components/tables/ProcessedQATable";

// const ProcessedQAPage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { processedIncidents, loading, totalPages } = useProcessedIncidents(currentPage, 10);

//   return (
//     <div>
//       {/* <h2>Processed QA</h2> */}
//       <ProcessedQATable incidents={processedIncidents} loading={loading} />
//     </div>
//   );
// };

// export default ProcessedQAPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Pagination } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const ProcessedQAPage = () => {
  const { user } = useAuth();
  const [processedIncidents, setProcessedIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10; // items per page

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.user_sid) {
        console.warn("⚠️ No user_sid found, skipping fetch.");
        return;
      }

      setLoading(true);
      try {
        const skip = (currentPage - 1) * limit;

        // ✅ POST request with pagination
        const res = await axios.post(
          "http://localhost:8000/api/users/get-processed/incidents/",
          {
            user_sid: user.user_sid,
            skip,
            limit,
          }
        );

        console.log("📌 Processed API Response:", res.data);

        setProcessedIncidents(res?.data || []);
        if (res.data?.totalCount) {
          setTotalPages(Math.ceil(res.data.totalCount / limit));
        }
      } catch (error) {
        console.error("❌ Error fetching processed incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user]);

  // ✅ Pagination with Previous & Next
  const renderPagination = () => {
    let items = [];

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      />
    );

    // Page numbers
    for (let page = 1; page <= totalPages; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      />
    );

    return <Pagination>{items}</Pagination>;
  };

  return (
    <div className="p-4">
      <h3 className="mb-4 fw-bold">✅ Processed QA Incidents</h3>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : processedIncidents.length === 0 ? (
        <Alert variant="info">No processed incidents found.</Alert>
      ) : (
        <>
          {/* Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Assigned QA</th>
              </tr>
            </thead>
            <tbody>
              {processedIncidents.map((incident, index) => (
                <tr key={incident.id || index}>
                  <td>{incident.id}</td>
                  <td>{incident.title || "N/A"}</td>
                  <td>{incident.audit_status}</td>
                  <td>{incident.assigned_qa_user_id || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            {renderPagination()}
          </div>
        </>
      )}
    </div>
  );
};

export default ProcessedQAPage;
