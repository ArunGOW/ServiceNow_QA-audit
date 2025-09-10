 // src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./layout/Layout";
import PendingQATable from "./tables/PendingQATable";
import ProcessedQATable from "./tables/ProcessedQATable";
import PaginationControls from "./PaginationControls";

const Dashboard = () => {
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [processedIncidents, setProcessedIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * limit;

        // ✅ Backend expects POST with skip & limit in the body
        const res = await axios.post(
          "http://localhost:8000/api/users/get/incidents",
          { skip, limit }
        );

        console.log("📌 API Response:", res.data);

        const allIncidents = res.data?.incidents || [];

        // ✅ Filter incidents by status
        setPendingIncidents(
          allIncidents.filter((i) => i.audit_status === "Pending")
        );
        setProcessedIncidents(
          allIncidents.filter((i) => i.audit_status === "Completed")
        );

        // ✅ if backend gives total count
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
  }, [currentPage]);

  return (
    <Layout>
      {/* Pending QA Table */}
      <PendingQATable incidents={pendingIncidents} loading={loading} />

      {/* Processed QA Table */}
      <ProcessedQATable incidents={processedIncidents} />

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          handleNext={() => setCurrentPage((p) => p + 1)}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
