import { Table, Spinner } from "react-bootstrap";

const UnassignedTable = ({ incidents, loading }) => {
  console.log("📌 Unassigned incidents passed to table:", incidents);

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <h5 className="fw-bold mb-3">Unassigned Tickets</h5>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Incident No</th>
              <th>Incident Date</th>
              <th>Short Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <tr key={incident.sid || index}>
                  <td>{incident.incident_number}</td>
                  <td>{incident.incident_date}</td>
                  <td>{incident.short_description}</td>
                  <td>{incident.resolution_status || "Unassigned"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No unassigned incidents found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UnassignedTable;
