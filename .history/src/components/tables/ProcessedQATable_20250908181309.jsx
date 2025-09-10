// src/components/tables/ProcessedQATable.jsx
import { Table } from "react-bootstrap";

const ProcessedQATable = ({ incidents }) => {
  return (
    <div className="bg-white rounded shadow-sm p-3 mt-4">
      <h5 className="fw-bold mb-3">Processed QA</h5>
      <Table bordered hover responsive className="align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>Incident #</th>
            <th>QA By</th>
            <th>QA On</th>
            <th>QA Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident, index) => (
            <tr key={index}>
              <td>{incident.incident_number || "N/A"}</td>
              <td>{incident.qa_by || "N/A"}</td>
              <td>{incident.qa_on || "N/A"}</td>
              <td>{incident.qa_status || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProcessedQATable;
