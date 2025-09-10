// src/components/tables/PendingQATable.jsx
import { Table, Spinner } from "react-bootstrap";

const PendingQATable = ({ incidents, loading }) => {
  return (
    <div className="bg-white rounded shadow-sm p-3">
      <h5 className="fw-bold mb-3">Pending QA</h5>
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
            {incidents.map((incident, index) => (
              <tr key={index}>
                <td>{incident.incident_number || "N/A"}</td>
                <td>{incident.handled_by || "N/A"}</td>
                <td>{incident.handled_on || "N/A"}</td>
                <td>{incident.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PendingQATable;
