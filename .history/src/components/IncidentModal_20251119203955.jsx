 import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import api from "../api/axois";

const IncidentModal = ({ show, onHide, incident }) => {
  const [editData, setEditData] = useState(incident || {});

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleCheckbox = (field) => {
    setEditData({ ...editData, [field]: !editData[field] });
  };

  const handleSave = async () => {
  try {
    if (!incident?.incident_sid) {
      alert("❌ Incident SID missing in modal!");
      return;
    }

    const payload = [
      {
        incident_sid: incident.incident_sid, // ✅ required by backend
        ...formData, // ✅ your edited fields
      },
    ];

    const response = await api.put("/incidents/update", payload);
    console.log("✅ Response:", response.data);
    // alert("Incident updated successfully!");
    onHide();
  } catch (error) {
    console.error("❌ Update failed:", error.response?.data || error.message);
    alert("Failed to update incident");
  }
};



  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Incident Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Incident & Description */}
          <Form.Group className="mb-3">
            <Form.Label><b>Incident</b></Form.Label>
            <Form.Control
              type="text"
              value={editData.incident_number || ""}
              onChange={(e) => handleChange("incident_number", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><b>Description</b></Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={editData.short_description || ""}
              onChange={(e) => handleChange("short_description", e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label><b>Handled by</b></Form.Label>
                <Form.Control
                  type="text"
                  value={editData.assigned_analyst || ""}
                  onChange={(e) =>
                    handleChange("assigned_analyst", e.target.value)
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label><b>Handled on</b></Form.Label>
                <Form.Control
                  type="date"
                  value={editData.incident_date || ""}
                  onChange={(e) => handleChange("incident_date", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label><b>Current Status</b></Form.Label>
                <Form.Control
                  type="text"
                  value={editData.resolution_status || ""}
                  onChange={(e) =>
                    handleChange("resolution_status", e.target.value)
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label><b>QA Status</b></Form.Label>
                <Form.Control
                  type="text"
                  value={editData.qa_status || ""}
                  onChange={(e) => handleChange("qa_status", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label><b>QA Done On</b></Form.Label>
                <Form.Control
                  type="date"
                  value={editData.audit_date?.split("T")[0] || ""}
                  onChange={(e) => handleChange("audit_date", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label><b>QA Agent</b></Form.Label>
                <Form.Control
                  type="text"
                  value={editData.qc_analyst || ""}
                  onChange={(e) => handleChange("qc_analyst", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label><b>QA Comments</b></Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={editData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </Form.Group>

          {/* Checkboxes */}
          <Row className="mt-3">
            <Col>
              <Form.Check
                type="checkbox"
                label="Correct Pruning"
                checked={editData.is_audited || false}
                onChange={() => handleCheckbox("is_audited")}
              />
              <Form.Check
                type="checkbox"
                label="Work Notes Added Properly"
                checked={editData.rca_done || false}
                onChange={() => handleCheckbox("rca_done")}
              />
              <Form.Check
                type="checkbox"
                label="Resolution Quality"
                checked={editData.kba_resolution_needed || false}
                onChange={() => handleCheckbox("kba_resolution_needed")}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="Timelines"
                checked={editData.grooming_needed || false}
                onChange={() => handleCheckbox("grooming_needed")}
              />
              <Form.Check
                type="checkbox"
                label="All Details Requested From User"
                checked={editData.grooming_done || false}
                onChange={() => handleCheckbox("grooming_done")}
              />
            </Col>
          </Row>

          {/* Grooming Section */}
          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label><b>Grooming Needed</b></Form.Label>
                <Form.Select
                  value={editData.grooming_needed ? "Yes" : "No"}
                  onChange={(e) =>
                    handleChange("grooming_needed", e.target.value === "Yes")
                  }
                >
                  <option>No</option>
                  <option>Yes</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label><b>Grooming Instructions</b></Form.Label>
                <Form.Control
                  type="text"
                  value={editData.updates_link || ""}
                  onChange={(e) => handleChange("updates_link", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label><b>Grooming Done On</b></Form.Label>
                <Form.Control
                  type="date"
                  value={editData.updated_at?.split("T")[0] || ""}
                  onChange={(e) => handleChange("updated_at", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label><b>Grooming Done By</b></Form.Label>
                <Form.Control
                  type="text"
                  value={editData.assigned_analyst || ""}
                  onChange={(e) =>
                    handleChange("assigned_analyst", e.target.value)
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IncidentModal;
