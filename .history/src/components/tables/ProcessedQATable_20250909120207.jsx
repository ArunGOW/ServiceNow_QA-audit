 // src/components/tables/ProcessedQATable.jsx
import { Table, Spinner } from "react-bootstrap";

const ProcessedQATable = ({ incidents, loading }) => {
  return (
    <div className="bg-white rounded shadow-sm p-3">
      <h5 className="fw-bold mb-3">Processed QA</h5>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Incident #</th>
              <th>Handled By</th>
              <th>Handled On</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <tr key={index}>
                  <td>{incident.incident_number || "N/A"}</td>
                  <td>{incident.assigned_analyst || "N/A"}</td>
                  <td>{incident.incident_date || "N/A"}</td>
                  <td>{incident.resolution_status || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No processed QA records found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProcessedQATable;
