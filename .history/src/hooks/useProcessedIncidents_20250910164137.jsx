import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useProcessedIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [processedIncidents, setProcessedIncidents] = useState([]);
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

      // ✅ POST request (body contains skip, limit, user_sid)
      const res = await axios.post(
        "http://localhost:8000/api/users/get-processed/incidents",
        {
          user_sid: user.user_sid,
          skip,
          limit,
        }
      );

      console.log("📌 Processed API Response:", res.data);

      setProcessedIncidents(res.data?.incidents || []);

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
}, [currentPage, user, limit]);


  return { processedIncidents, loading, totalPages };
};

export default useProcessedIncidents;
