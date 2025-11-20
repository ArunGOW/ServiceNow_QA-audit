import { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axois";
import "../PendingQATable.css";

const GroomingTable = ({ incidents, loading }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [qualityPoints, setQualityPoints] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const { user } = useAuth();
  const loggedUserSid = user?.user_sid;

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/get/list_users");
        setUsers(res.data || []);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Quality Points
  useEffect(() => {
    const fetchQualityPoints = async () => {
      try {
        const res = await api.get("/users/quality-check-points");
        const points = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setQualityPoints(points);
      } catch (error) {
        console.error("❌ Failed to load quality points", error);
      }
    };
    fetchQualityPoints();
  }, []);

  // Auto-calculate total score
  useEffect(() => {
    if (selectedComments.length > 0) {
      const total = selectedComments.reduce((sum, item) => sum + (Number(item.point_value) || 0), 0);
      setTotalScore(total);
    } else if (formData?.scores && Object.keys(formData.scores).length > 0) {
      const total = Object.values(formData.scores).reduce(
        (sum, val) => sum + (Number(val.point_value) || 0),
        0
      );
      setTotalScore(total);
    } else {
      setTotalScore(0);
    }
  }, [selectedComments, formData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr.split("T")[0];
    const parts = dateStr.split("/"); // DD/MM/YYYY
    if (parts.length !== 3) return "";
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day).toISOString().split("T")[0];
  };

  const handleOpenModal = (incident) => {
    setSelectedIncident(incident);
    setFormData({
      ...incident,
      incident_sid: incident.sid,
      qc_analyst: user?.full_name || "",
      audit_date: incident.audit_date || new Date().toISOString().split("T")[0],
    });

    if (incident.qa_comment) {
      const selectedNames = incident.qa_comment.split(", ").map((name) => name.trim());
      const preSelected = qualityPoints.filter((qp) => selectedNames.includes(qp.check_point_name));
      setSelectedComments(preSelected);
    } else {
      setSelectedComments([]);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
    setFormData({});
    setSelectedComments([]);
    setTotalScore(0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;
    if (name === "grooming_needed") finalValue = value === "Yes";

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleCommentToggle = (comment) => {
    setSelectedComments((prev) => {
      const updated = prev.find((c) => c.sid === comment.sid)
        ? prev.filter((c) => c.sid !== comment.sid)
        : [...prev, comment];
      return updated;
    });
  };

  const handleSelectIncident = (incidentSid) => {
    setSelectedIncidents((prev) =>
      prev.includes(incidentSid) ? prev.filter((id) => id !== incidentSid) : [...prev, incidentSid]
    );
  };

  const handleSelectAll = () => {
    if (selectedIncidents.length === incidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(incidents.map((i) => i.sid));
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formData.incident_sid) return alert("Incident SID missing!");

      const payload = [
        {
          ...formData,
          audit_date: formatDate(formData.audit_date),
          scores: selectedComments.reduce((acc, item) => {
            acc[item.check_point_name] = {
              description: item.check_point_description,
              point_value: item.point_value,
            };
            return acc;
          }, {}),
        },
      ];

      const res = await api.post("/users/update/incident-status", payload);
      alert(`Message: ${res.data.message}`);
      handleCloseModal();
    } catch (error) {
      console.error("❌ Update error:", error.response?.data || error.message);
      alert("Failed to update incident.");
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Pending Grooming</h5>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th style={{ width: "65px" }}>
                <Form.Check
                  type="checkbox"
                  checked={selectedIncidents.length === incidents.length && incidents.length > 0}
                  onChange={handleSelectAll}
                />
                <span className="ms-1">Select All</span>
              </th>
              <th>Incident No</th>
              <th>Short Description</th>
              <th>Assigned Analyst</th>
              <th>Incident Date</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((incident, idx) => (
                <tr key={incident.sid || idx}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedIncidents.includes(incident.sid)}
                      onChange={() => handleSelectIncident(incident.sid)}
                    />
                  </td>
                  <td>
                    <Button variant="link" onClick={() => handleOpenModal(incident)} style={{ padding: 0 }}>
                      {incident.incident_number}
                    </Button>
                  </td>
                  <td title={incident.short_description}>{incident.short_description || "N/A"}</td>
                  <td>{incident.assigned_analyst || "N/A"}</td>
                  <td>{incident.incident_date || "N/A"}</td>
                  <td>{incident.priority || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No grooming incidents found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Incident Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <Form>
              {/* Incident Info */}
              <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                <h6>Incident Information</h6>
                <Row>
                  <Col md={4}>
                    <div><strong>Incident No:</strong> {formData.incident_number || "N/A"}</div>
                  </Col>
                  <Col md={8}>
                    <div><strong>Description:</strong> {formData.short_description || "N/A"}</div>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}><div><strong>Handled By:</strong> {formData.assigned_analyst || "N/A"}</div></Col>
                  <Col md={4}><div><strong>Handled On:</strong> {formatDate(formData.incident_date) || "N/A"}</div></Col>
                  <Col md={4}><div><strong>Status:</strong> {formData.resolution_status || "N/A"}</div></Col>
                </Row>
              </div>

              {/* QA Details */}
              <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                <h6>QA Details</h6>
                <Row className="align-items-start">
                  <Col md={8}>
                    <div>
                      <strong>QA Comments:</strong>
                      {formData?.scores ? (
                        <div>
                          {Object.entries(formData.scores).map(([k, v], i) => (
                            <div key={i}>{k}: {v.description} (Score: {v.point_value})</div>
                          ))}
                        </div>
                      ) : "N/A"}
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <strong>Total Score:</strong> <span className="badge bg-primary">{totalScore}</span>
                  </Col>
                </Row>
              </div>

              {/* Grooming Details */}
              <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                <h6>Grooming Details</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Grooming Needed</Form.Label>
                      <Form.Select
                        name="grooming_needed"
                        value={formData.grooming_needed ? "Yes" : "No"}
                        onChange={handleChange}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
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
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      name="grooming_done"
                      checked={!!formData.grooming_done}
                      onChange={handleChange}
                      label="Grooming Done"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      name="kba_resolution_updated"
                      checked={!!formData.kba_resolution_updated}
                      onChange={handleChange}
                      label="KBA Resolution Updated"
                    />
                  </Col>
                </Row>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleUpdate}>Save</Button>
          <Button variant="outline-dark" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroomingTable;
