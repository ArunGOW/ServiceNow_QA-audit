import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import api from "../api/axois";

const useUnassignedIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [unassignedIncidents, setUnassignedIncidents] = useState([]);
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
        const res = await api.post(
          "http://localhost:8000/api/users/get-unassigned/incidents/",
          {
            user_sid: user.user_sid,
            page: currentPage,
            per_page: limit,
          }
        );

        console.log("📌 Unassigned API Response:", res.data);

        setUnassignedIncidents(Array.isArray(res.data.response) ? res.data.response : []);

        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / limit));
        }
      } catch (error) {
        console.error("❌ Error fetching unassigned incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user, limit]);

  return { unassignedIncidents, loading, totalPages };
};

export default useUnassignedIncidents;
