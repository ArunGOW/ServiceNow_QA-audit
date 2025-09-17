import { Table, Spinner } from "react-bootstrap";

const GroomingTable = ({ incidents, loading }) => {
  console.log("📌 Grooming incidents passed to table:", incidents);

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <h5 className="fw-bold mb-3">Pending Grooming</h5>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Incident No</th>
              <th>Assigned Analyst</th>
              <th>Incident Date</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <tr key={incident.sid || index}>
                  <td>{incident.incident_number}</td>
                  <td>{incident.assigned_analyst}</td>
                  <td>{incident.incident_date}</td>
                  <td>{incident.priority || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No grooming incidents found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default GroomingTable;
