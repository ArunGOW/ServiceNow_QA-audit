

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axois";

const usePendingIncidents = (currentPage, limit = 10) => {
  const { user } = useAuth();
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    if (!user?.user_sid) return;

    setLoading(true);
    try {
      const res = await api.post("/users/get-pending/incidents/", {
        user_sid: user.user_sid,
        page: currentPage,
        per_page: limit,
      });

      const responseData = Array.isArray(res.data.response)
        ? res.data.response
        : [];

      setPendingIncidents(responseData);
      if (res.data.total) {
        setTotalPages(Math.ceil(res.data.total / limit));
      }
    } catch (error) {
      console.error("❌ Error fetching pending incidents:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, user, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { pendingIncidents, loading, totalPages, refresh: fetchData };
};

export default usePendingIncidents;

