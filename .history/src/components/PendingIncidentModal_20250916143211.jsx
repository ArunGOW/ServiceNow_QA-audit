// src/components/PendingIncidentModal.jsx
import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const PendingIncidentModal = ({
  show,
  handleClose,
  formData,
  handleChange,
  handleUpdate,
}) => {
  if (!formData) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Incident Details - {formData.incident_number}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Incident Info */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assigned Analyst</Form.Label>
                <Form.Control
                  type="text"
                  name="assigned_analyst"
                  value={formData.assigned_analyst || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Audit Status</Form.Label>
                <Form.Control
                  as="select"
                  name="audit_status"
                  value={formData.audit_status || ""}
                  onChange={handleChange}
                >
                  <option value="">-- Select Status --</option>
                  <option value="Correct">Correct</option>
                  <option value="Incorrect">Incorrect</option>
                  <option value="On Hold">On Hold</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Incident Date */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Incident Date</Form.Label>
                <Form.Control
                  type="text"
                  name="incident_date"
                  value={formData.incident_date || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Resolution Status</Form.Label>
                <Form.Control
                  type="text"
                  name="resolution_status"
                  value={formData.resolution_status || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Short Description */}
          <Form.Group className="mb-3">
            <Form.Label>Short Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="short_description"
              value={formData.short_description || ""}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Notes */}
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Checkboxes */}
          <Row>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                label="Grooming Needed"
                name="grooming_needed"
                checked={formData.grooming_needed || false}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "grooming_needed",
                      value: e.target.checked,
                    },
                  })
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                label="RCA Done"
                name="rca_done"
                checked={formData.rca_done || false}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "rca_done",
                      value: e.target.checked,
                    },
                  })
                }
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PendingIncidentModal;
