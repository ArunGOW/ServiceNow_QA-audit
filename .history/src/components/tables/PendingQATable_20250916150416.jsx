
import { Table, Spinner, Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

const PendingQATable = ({ incidents, loading }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleOpenModal = (incident) => {
    setSelectedIncident(incident);
    setFormData(incident); // pre-fill form
    setShowModal(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    console.log("✅ Updated Data:", formData);
    // TODO: API call to update backend
    setIsEditing(false);
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <h5 className="fw-bold mb-3">Pending QA</h5>
      {loading ? (
        <div className="text-center py-5">
          {/* <Spinner animation="border" variant="primary" /> */}
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Incident No</th>
              <th>Handled By</th>
              <th>Handled On</th>
               <th>QC-Analyst</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <tr key={incident.sid || index}>
                  <td
                     
                  >
                     <Button
                  variant="link"
                  onClick={() => handleShow(incident)}
                  style={{ padding: 0 }}
                >
                  {incident.incident_number}
                </Button>
                  </td>
                  <td>{incident.assigned_analyst}</td>
                  <td>{incident.incident_date}</td>
                  <td>{incident.qc_analyst}</td>
                  <td>{incident.resolution_status}</td>
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

      {/* ✅ Modal Popup */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pending QA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Incident #</Form.Label>
                <Form.Control
                  type="text"
                  name="incident_number"
                  value={formData.incident_number || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Handled by</Form.Label>
                <Form.Control
                  type="text"
                  name="assigned_analyst"
                  value={formData.assigned_analyst || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Handled on</Form.Label>
                <Form.Control
                  type="text"
                  name="incident_date"
                  value={formData.incident_date || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Current status</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="audit_status"
                  value={formData.audit_status || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!isEditing ? (
            <Button variant="secondary" onClick={handleEdit}>
              Edit
            </Button>
          ) : (
            <Button variant="success" onClick={handleUpdate}>
              Save
            </Button>
          )}
          <Button variant="outline-dark" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
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

 