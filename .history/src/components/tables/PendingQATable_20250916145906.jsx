 // src/components/PendingQATable.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import PendingIncidentModal from "../PendingIncidentModal";

const PendingQATable = () => {
  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const limit = 10;

  // ✅ Fetch incidents
  useEffect(() => {
    fetchIncidents(page);
  }, [page]);

  const fetchIncidents = async (page) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/get-pending/incidents/",
        {
          user_sid: "ffea30b7-0cb1-46b3-8be9-0a865d76e192",
          page,
          per_page: limit,
        }
      );
      setIncidents(res.data.response || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching pending incidents:", err);
    }
  };

  // ✅ Open Modal
  const handleShow = (incident) => {
    setSelectedIncident(incident);
    setShowModal(true);
  };

  // ✅ Close Modal
  const handleClose = () => {
    setSelectedIncident(null);
    setShowModal(false);
  };

  // ✅ Handle input/checkbox change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedIncident((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Update Incident (PUT API)
  const handleUpdate = async () => {
    if (!selectedIncident?.sid) return;

    try {
      const res = await axios.put(
        `http://localhost:8000/api/users/update-pending/${selectedIncident.sid}`,
        selectedIncident
      );

      // Refresh table after update
      fetchIncidents(page);

      alert("Incident updated successfully ✅");
      handleClose();
    } catch (err) {
      console.error("Error updating incident:", err);
      alert("Failed to update incident ❌");
    }
  };

  // ✅ Pagination
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h3>Pending QA Incidents</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Incident #</th>
            <th>Assigned Analyst</th>
            <th>Status</th>
            <th>Incident Date</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.sid}>
              <td>
                <Button
                  variant="link"
                  onClick={() => handleShow(incident)}
                  style={{ padding: 0 }}
                >
                  {incident.incident_number}
                </Button>
              </td>
              <td>{incident.assigned_analyst}</td>
              <td>{incident.audit_status}</td>
              <td>{incident.incident_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* ✅ Modal for Editing */}
      {selectedIncident && (
        <PendingIncidentModal
          show={showModal}
          handleClose={handleClose}
          formData={selectedIncident}
          handleChange={handleChange}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default PendingQATable;
