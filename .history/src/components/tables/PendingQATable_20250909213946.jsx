 // src/components/tables/PendingQATable.jsx
import { Table, Spinner, Badge } from "react-bootstrap";

 const PendingQATable = ({ incidents, loading }) => {
  console.log("🟢 Pending Incidents passed to table:", incidents);

  if (loading) return <p>Loading...</p>;

  if (!incidents || incidents.length === 0) {
    return <p>No pending incidents found.</p>;
  }
  useEffect(() => {
  const fetchData = async () => {
    if (!user?.user_sid) {
      console.warn("⚠️ No user_sid found, skipping fetch.");
      return;
    }

    setLoading(true);
    try {
      const skip = (currentPage - 1) * limit;

      const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
        user_sid: user.user_sid,
        skip,
        limit,
      });

      console.log("📌 Full API Response:", res.data);

      const allIncidents = res.data?.incidents || [];

      // 🔎 Log audit_status of each incident
      console.log("🔍 audit_status values from API:", allIncidents.map(i => i.audit_status));

      setPendingIncidents(
        allIncidents.filter((i) => i.audit_status?.toLowerCase() === "pending")
      );
      setProcessedIncidents(
        allIncidents.filter((i) => i.audit_status?.toLowerCase() === "completed")
      );

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
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Incident ID</th>
          <th>Description</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {incidents.map((incident, index) => (
          <tr key={incident.id || index}>
            <td>{index + 1}</td>
            <td>{incident.incident_id || "-"}</td>
            <td>{incident.description || "-"}</td>
            <td>{incident.audit_status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default PendingQATable;
