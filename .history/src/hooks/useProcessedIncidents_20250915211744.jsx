 import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useProcessedIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [processedIncidents, setProcessedIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user?.user_sid) return;
      setLoading(true);
      try {
        const res = await axios.post(
          "http://localhost:8000/api/users/get-processed/incidents/",
          { user_sid: user.user_sid, page: currentPage, per_page: limit }
        );
        if (!isMounted) return;
        setProcessedIncidents(res.data.response || []);
        if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        console.error("❌ Processed fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [currentPage, user]);

  return { processedIncidents, loading, totalPages };
};

export default useProcessedIncidents;
