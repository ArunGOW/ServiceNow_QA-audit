 import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Date helpers
const toDateInput = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0]; // format yyyy-MM-dd
};

const toISODate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
};

const IncidentModal = ({ show, onHide, incident }) => {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (incident) {
      setFormData(incident); // ✅ auto-load response
    }
  }, [incident]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      incident_date: toISODate(formData.incident_date),
      audit_date: toISODate(formData.audit_date),
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/update/incident-status",
        [payload]
      );
      alert(res.data.message || "Incident updated successfully!");
      setIsEditing(false);
      onHide();
    } catch (error) {
      console.error("❌ Error updating:", error.response?.data || error);
      alert("Failed to update incident");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Incident Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formData && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Incident #</Form.Label>
              <Form.Control
                type="text"
                value={formData.incident_number || ""}
                readOnly
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="fw-bold">Incident Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="incident_date"
                    value={toDateInput(formData.incident_date)}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label className="fw-bold">Audit Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="audit_date"
                    value={toDateInput(formData.audit_date)}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="short_description"
                value={formData.short_description || ""}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Resolution Status</Form.Label>
              <Form.Control
                type="text"
                name="resolution_status"
                value={formData.resolution_status || ""}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!isEditing ? (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        )}
        <Button variant="outline-dark" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IncidentModal;
