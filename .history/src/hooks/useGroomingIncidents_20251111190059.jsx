import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import api from "../api/axois";

const useGroomingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [groomingIncidents, setGroomingIncidents] = useState([]);
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
          "http://localhost:8000/api/users/user/grooming-needed",
          {
            user_sid: user.user_sid,
            page: currentPage,
            per_page: limit,
          }
        );

        console.log("📌 Grooming API Response:", res.data);

        // ✅ Assume data is inside response array
        setGroomingIncidents(Array.isArray(res.data.response) ? res.data.response : []);

        // ✅ Calculate total pages if available
        if (res.data.total) {
          setTotalPages(Math.ceil(res.data.total / limit));
        }
      } catch (error) {
        console.error("❌ Error fetching grooming incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, user, limit]);

  return { groomingIncidents, loading, totalPages };
};

export default useGroomingIncidents;
