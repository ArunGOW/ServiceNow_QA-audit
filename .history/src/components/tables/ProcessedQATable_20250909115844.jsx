 // src/pages/ProcessedQAPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import ProcessedQATable from "../components/tables/ProcessedQATable";
import PaginationControls from "../components/PaginationControls";

const ProcessedQAPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * limit;
        const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
          skip,
          limit,
        });
        setIncidents(res.data.processed || []);
      } catch (error) {
        console.error("Error fetching processed incidents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  return (
    <>
      <ProcessedQATable incidents={incidents} loading={loading} />
      <div className="d-flex justify-content-center mt-3">
        <PaginationControls
          currentPage={currentPage}
          totalPages={20}
          handlePrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          handleNext={() => setCurrentPage((p) => p + 1)}
        />
      </div>
    </>
  );
};

export default ProcessedQAPage;
