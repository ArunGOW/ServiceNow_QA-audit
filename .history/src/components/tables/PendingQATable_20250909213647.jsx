 // src/components/tables/PendingQATable.jsx
import { Table, Spinner, Badge } from "react-bootstrap";

 const PendingQATable = ({ incidents, loading }) => {
  console.log("🟢 Pending Incidents passed to table:", incidents);

  if (loading) return <p>Loading...</p>;

  if (!incidents || incidents.length === 0) {
    return <p>No pending incidents found.</p>;
  }

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
