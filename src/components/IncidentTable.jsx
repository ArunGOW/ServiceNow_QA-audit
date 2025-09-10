import React from "react";
import { Table } from "react-bootstrap";

const IncidentTable = ({ incidents }) => {
  return (
    <div className="mt-4 p-4 border rounded bg-white shadow-lg">
      <h4 className="mb-4 text-center fw-bold text-primary">📊 INCIDENT LIST</h4>

      <Table bordered hover responsive striped className="align-middle shadow-sm">
        <thead
          style={{
            background: "linear-gradient(90deg, #0d6efd, #6610f2)",
            color: "white",
          }}
        >
          <tr>
            <th style={{ width: "12%", textAlign: "center" }}>INCIDENT NO</th>
            <th style={{ width: "40%", textAlign: "left" }}>SHORT DESCRIPTION</th>
            <th style={{ width: "15%", textAlign: "center" }}>STATUS</th>
            <th style={{ width: "15%", textAlign: "center" }}>ASSIGNED TO</th>
            <th style={{ width: "15%", textAlign: "center" }}>ANALYST</th>
          </tr>
        </thead>
        <tbody>
          {incidents.length > 0 ? (
            incidents.map((incident, index) => (
              <tr key={index}>
                <td className="text-center">{incident.incident_number || "N/A"}</td>
                <td className="text-start">{incident.short_description || "N/A"}</td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      incident.audit_status === "Completed"
                        ? "bg-success"
                        : incident.audit_status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {incident.audit_status || "N/A"}
                  </span>
                </td>
                <td className="text-center">{incident.assigned_analyst || "Unassigned"}</td>
                <td className="text-center">{incident.qc_analyst || "NO"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-muted py-4">
                No incidents found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default IncidentTable;
