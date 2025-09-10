 // src/components/tables/ProcessedQATable.jsx
import { Table, Spinner, Badge } from "react-bootstrap";

const ProcessedQATable = ({ incidents, loading }) => {
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;
    if (status.toLowerCase() === "escalated")
      return <Badge bg="warning" text="dark">Escalated</Badge>;
    if (status.toLowerCase() === "resolved")
      return <Badge bg="success">Resolved</Badge>;
    return <Badge bg="info">{status}</Badge>;
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <h5 className="fw-bold mb-3 text-success">Processed QA</h5>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : incidents.length > 0 ? (
        <Table bordered hover responsive className="align-middle">
          <thead className="table-success">
            <tr>
              <th className="text-center">Incident #</th>
              <th className="text-start">Handled By</th>
              <th className="text-center">Handled On</th>
              <th className="text-center">QA Analyst</th>
              <th className="text-center">Final Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => (
              <tr key={index}>
                <td className="text-center">{incident.incident_number || "N/A"}</td>
                <td className="text-start">{incident.assigned_analyst || "N/A"}</td>
                <td className="text-center">{incident.incident_date || "N/A"}</td>
                <td className="text-center">{incident.qc_analyst || "N/A"}</td>
                <td className="text-center">{getStatusBadge(incident.resolution_status)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted text-center py-4">No processed incidents found.</p>
      )}
    </div>
  );
};

export default ProcessedQATable;
