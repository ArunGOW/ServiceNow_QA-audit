import { Table, Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axois";
import "../PendingQATable.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logger from "../../utils/logger";

const PendingQATable = ({ incidents, loading, refresh }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { user } = useAuth();

  const [qualityPoints, setQualityPoints] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  // Fetch users/agents
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await api.get("/users/get/list_users");
        setUsers(res.data || []);
      } catch (error) {
        logger.error("Error fetching users:", error);
        toast.error("Failed to load agents list!");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Quality Check Points
  useEffect(() => {
    const fetchQualityPoints = async () => {
      try {
        const res = await api.get("/users/quality-check-points");
        // Ensure we handle the nested structure from your API response
        const points = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setQualityPoints(points);
      } catch (error) {
        logger.error("Error fetching quality points:", error);
        toast.error("Failed to load quality check points!");
      }
    };
    fetchQualityPoints();
  }, []);

  // Toggle selection for Sub-Categories
  const handleSubPointToggle = (parentPoint, subPoint) => {
    setSelectedComments((prev) => {
      let updated;
      const exists = prev.find((c) => c.sub_sid === subPoint.sid);

      if (exists) {
        // Remove if already selected
        updated = prev.filter((c) => c.sub_sid !== subPoint.sid);
      } else {
        // Add new selection
        updated = [
          ...prev,
          {
            parent_sid: parentPoint.sid,
            parent_name: parentPoint.check_point_name,
            sub_sid: subPoint.sid,
            sub_name: subPoint.sub_check_point_name,
            point_value: subPoint.max_points,
          },
        ];
      }

      // Calculate new total score
      const scoreSum = updated.reduce((sum, item) => sum + (item.point_value || 0), 0);
      setTotalScore(scoreSum);
      return updated;
    });
  };

  const handleOpenModal = (incident) => {
    setSelectedIncident(incident);
    setFormData({
      ...incident,
      incident_sid: incident.sid,
      qc_analyst: user?.full_name || "",
      audit_date: incident.audit_date || new Date().toISOString().split("T")[0],
    });

    // Reset QA selections when opening a new incident
    setSelectedComments([]);
    setTotalScore(0);
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
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleUpdate = async () => {
    if (!formData?.incident_sid) return toast.warn("Incident SID missing!");

    // Construct scores object for the payload
    const scoresPayload = selectedComments.reduce((acc, item) => {
      if (!acc[item.parent_name]) {
        acc[item.parent_name] = { sub_points: [] };
      }
      acc[item.parent_name].sub_points.push({
        name: item.sub_name,
        points: item.point_value,
      });
      return acc;
    }, {});

    const payload = [{
      ...formData,
      is_audited: true,
      audit_status: "done",
      audit_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_qa_score: totalScore,
      qa_details: scoresPayload, // Sending the nested details
    }];

    try {
      const res = await api.post("/users/update/incident-status", payload);
      toast.success(res.data.message || "Incident updated successfully");
      handleCloseModal();
      if (refresh) refresh();
    } catch (error) {
      logger.error("Update Error:", error);
      toast.error("Failed to update incident");
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="d-flex justify-content-center align-items-center mb-3">
        <h5 className="fw-bold">Pending QA</h5>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Select</th>
              <th>Incident No</th>
              <th>Short Description</th>
              <th>Handled By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.sid}>
                <td>
                  <Form.Check 
                    checked={selectedIncidents.includes(incident.sid)}
                    onChange={() => {}} 
                  />
                </td>
                <td>{incident.incident_number}</td>
                <td className="text-start">{incident.short_description}</td>
                <td>{incident.assigned_analyst}</td>
                <td>
                  <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(incident)}>
                    Audit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* QA MODAL */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Quality Audit: {selectedIncident?.incident_number}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">QC Analyst</Form.Label>
                  <Form.Control type="text" value={formData.qc_analyst} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Audit Date</Form.Label>
                  <Form.Control type="date" value={formData.audit_date} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h6 className="fw-bold text-secondary mb-3">Quality Check Points</h6>
            
            <div className="qa-checklist-container border rounded p-3 bg-light">
              {qualityPoints.map((category) => (
                <div key={category.sid} className="mb-4 bg-white p-2 rounded border-start border-primary border-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                    <span className="fw-bold text-dark">{category.check_point_name}</span>
                    <span className="badge bg-primary">Max: {category.point_value}</span>
                  </div>
                  
                  <div className="ms-3">
                    {category.sub_categories?.map((sub) => (
                      <Form.Check 
                        key={sub.sid}
                        type="checkbox"
                        id={`check-${sub.sid}`}
                        className="mb-2"
                        label={
                          <div className="d-flex justify-content-between">
                            <span>
                              <strong>{sub.sub_check_point_name}</strong> - 
                              <small className="text-muted ms-1">{sub.sub_check_point_description}</small>
                            </span>
                            <span className="text-success fw-bold">+{sub.max_points}</span>
                          </div>
                        }
                        checked={selectedComments.some(c => c.sub_sid === sub.sid)}
                        onChange={() => handleSubPointToggle(category, sub)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Score Summary Box */}
            <div className="mt-4 p-3 bg-dark text-white rounded d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Total Audit Score</h5>
                <small className="text-info">Based on selected quality criteria</small>
              </div>
              <div className="text-end">
                <span className="display-6 fw-bold text-warning">{totalScore}</span>
                <span className="ms-2 text-muted">Points</span>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="success" onClick={handleUpdate}>Submit Quality Audit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingQATable;