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
        <Modal.Title>Incident Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Incident & Description */}
          <Form.Group className="mb-3">
            <Form.Label>Incident</Form.Label>
            <Form.Control
              type="text"
              name="incident_number"
              value={formData.incident_number || ""}
              onChange={handleChange}
              readOnly
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="short_description"
              value={formData.short_description || ""}
              onChange={handleChange}
            />
          </Form.Group>

          <hr />

          {/* Handled Info */}
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Handled by</Form.Label>
                <Form.Control
                  type="text"
                  name="assigned_analyst"
                  value={formData.assigned_analyst || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Handled on</Form.Label>
                <Form.Control
                  type="text"
                  name="incident_date"
                  value={formData.incident_date || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Current Status</Form.Label>
                <Form.Control
                  type="text"
                  name="resolution_status"
                  value={formData.resolution_status || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* QA Section */}
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>QA Status</Form.Label>
                <Form.Control
                  type="text"
                  name="qa_status"
                  value={formData.qa_status || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>QA Done On</Form.Label>
                <Form.Control
                  type="text"
                  name="audit_date"
                  value={formData.audit_date || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>QA Agent</Form.Label>
                <Form.Control
                  type="text"
                  name="qc_analyst"
                  value={formData.qc_analyst || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>QA Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="qa_comments"
              value={formData.qa_comments || ""}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Checkboxes */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Check
                type="checkbox"
                label="Correct Pruning"
                name="correct_pruning"
                checked={formData.correct_pruning || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: "correct_pruning", value: e.target.checked },
                  })
                }
              />
              <Form.Check
                type="checkbox"
                label="Work Notes Added Properly"
                name="work_notes_added"
                checked={formData.work_notes_added || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: "work_notes_added", value: e.target.checked },
                  })
                }
              />
              <Form.Check
                type="checkbox"
                label="Resolution Quality"
                name="resolution_quality"
                checked={formData.resolution_quality || false}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "resolution_quality",
                      value: e.target.checked,
                    },
                  })
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="checkbox"
                label="Timelines"
                name="timelines"
                checked={formData.timelines || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: "timelines", value: e.target.checked },
                  })
                }
              />
              <Form.Check
                type="checkbox"
                label="All Details Requested From User"
                name="details_requested"
                checked={formData.details_requested || false}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "details_requested",
                      value: e.target.checked,
                    },
                  })
                }
              />
            </Col>
          </Row>

          {/* Grooming Section */}
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Grooming Needed</Form.Label>
                <Form.Select
                  name="grooming_needed"
                  value={formData.grooming_needed ? "Yes" : "No"}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "grooming_needed",
                        value: e.target.value === "Yes",
                      },
                    })
                  }
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Grooming Instructions</Form.Label>
                <Form.Control
                  type="text"
                  name="grooming_instructions"
                  value={formData.grooming_instructions || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Grooming Done On</Form.Label>
                <Form.Control
                  type="text"
                  name="grooming_done_on"
                  value={formData.grooming_done_on || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Grooming Done By</Form.Label>
                <Form.Control
                  type="text"
                  name="grooming_done_by"
                  value={formData.grooming_done_by || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PendingIncidentModal;
