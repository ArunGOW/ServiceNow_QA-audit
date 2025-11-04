 

// src/components/tables/PendingQATable.jsx
import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axois";
import "../PendingQATable.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingQATable = ({ incidents, loading, refresh }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useAuth();
  const loggedUserSid = user?.user_sid;
  const [localIncidents, setLocalIncidents] = useState([]);

  const [qualityPoints, setQualityPoints] = useState([]);
const [selectedComment, setSelectedComment] = useState("");
const [selectedScore, setSelectedScore] = useState(0);
const [isChecked, setIsChecked] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false)
const [selectedComments, setSelectedComments] = useState([]); // Array of selected comments
const [totalScore, setTotalScore] = useState(0);


  // ✅ Keep only unresolved incidents in local state
  useEffect(() => {
    if (!incidents || incidents.length === 0) {
      setLocalIncidents([]);
      return;
    }

    const filtered = incidents.filter(
      (i) =>
        i.resolution_status &&
        i.resolution_status.trim().toLowerCase() !== "resolved"
    );

    setLocalIncidents(filtered);
  }, [incidents]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/get/list_users");
        setUsers(res.data || []);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        toast.error("Failed to load user list!");
      }
    };
    fetchUsers();
  }, []);
  const handleCommentToggle = (comment) => {
  setSelectedComments((prev) => {
    let updated;
    if (prev.find((c) => c.sid === comment.sid)) {
      // Uncheck → remove from selected
      updated = prev.filter((c) => c.sid !== comment.sid);
    } else {
      // Check → add to selected
      updated = [...prev, comment];
    }
    const scoreSum = updated.reduce((sum, item) => sum + (item.point_value || 0), 0);
    setTotalScore(scoreSum);
    return updated;
  });
};


  //quality check point
 useEffect(() => {
  const fetchQualityPoints = async () => {
    try {
      const res = await api.get("http://localhost:8000/api/users/quality-check-points");
      console.log("✅ Quality check API response:", res.data);
      // Adjust depending on structure
      const points = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.results || [];
      setQualityPoints(points);
    } catch (error) {
      console.error("❌ Error fetching quality points:", error.response?.data || error.message);
      toast.error("Failed to load quality check points!");
    }
  };
  fetchQualityPoints();
}, []);

 

 const handleOpenModal = (incident) => {
  setSelectedIncident(incident);
  setFormData({
    ...incident,
    incident_sid: incident.sid,
  });

  if (incident.qa_comment) {
    const selectedNames = incident.qa_comment.split(", ").map(name => name.trim());
    const preSelected = qualityPoints.filter(qp => selectedNames.includes(qp.check_point_name));
    setSelectedComments(preSelected);
    const scoreSum = preSelected.reduce((sum, item) => sum + (item.point_value || 0), 0);
    setTotalScore(scoreSum);
  } else {
    setSelectedComments([]);
    setTotalScore(0);
  }

  setShowModal(true);
};


const handleDropdownChange = (e) => {
  const selectedOptions = Array.from(e.target.selectedOptions).map(opt =>
    qualityPoints.find(qp => qp.sid === opt.value)
  );
  setSelectedComments(selectedOptions);

  const scoreSum = selectedOptions.reduce((sum, item) => sum + (item.point_value || 0), 0);
  setTotalScore(scoreSum);
};


  // Modal controls
  // const handleOpenModal = (incident) => {
  //   setSelectedIncident(incident);
  //   setFormData({
  //     ...incident,
  //     incident_sid: incident.sid,
  //   });
  //   setShowModal(true);
  // };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
    setFormData({});
  };

  // Form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;
    if (name === "grooming_needed") finalValue = value === "Yes";
    else if (type === "checkbox") finalValue = checked;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  // Format date YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr.split("T")[0];
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return date.toISOString().split("T")[0];
  };

  // ✅ Update incident
  const handleUpdate = async () => {
    try {
      if (!formData.incident_sid || !formData.incident_number) {
        toast.warn("Incident SID or Incident Number is missing!");
        return;
      }

      const payload = [
        {
          incident_sid: formData.incident_sid,
          incident_number: formData.incident_number,
          incident_date: formatDate(formData.incident_date),
          short_description: formData.short_description || "",
          resolution_status: formData.resolution_status || "",
          resolution_shared: formData.resolution_shared || "",
          updates_link: formData.updates_link || "",
          notes: formData.notes || "",
          assigned_analyst: formData.assigned_analyst || "",
          qc_analyst: formData.qc_analyst || "",
          is_audited: formData.is_audited ?? true,
          audit_status: formData.audit_status || "done",
          audit_date: formatDate(formData.audit_date),
          qa_status: formData.qa_status || "done",
          rca_done: !!formData.rca_done,
          grooming_needed: !!formData.grooming_needed,
          grooming_done: !!formData.grooming_done,
          kba_resolution_needed: !!formData.kba_resolution_needed,
          kba_resolution_updated: !!formData.kba_resolution_updated,
          updated_at: new Date().toISOString().split("T")[0],
          qa_comment: selectedComments.map(c => c.check_point_name).join(", "), // Optional: join for backend
    qa_score: totalScore,
        },
      ];

      const res = await api.post("/users/update/incident-status", payload);

      toast.success(`✅ ${res.data.message || "Incident updated successfully"}`);

      // ✅ Remove resolved tickets immediately
      if (
        formData.resolution_status &&
        formData.resolution_status.trim().toLowerCase() === "resolved"
      ) {
        setLocalIncidents((prev) =>
          prev.filter((i) => i.sid !== formData.incident_sid)
        );
      }

      if (typeof refresh === "function") await refresh();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error updating incident:", error.response?.data || error.message);
      toast.error(
        `❌ Failed to update incident: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Select incidents
  const handleSelectIncident = (incidentSid) => {
    setSelectedIncidents((prev) =>
      prev.includes(incidentSid)
        ? prev.filter((id) => id !== incidentSid)
        : [...prev, incidentSid]
    );
  };

  const pendingIncidents = localIncidents;

  const handleSelectAll = () => {
    if (selectedIncidents.length === pendingIncidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(pendingIncidents.map((i) => i.sid));
    }
  };

  // ✅ Assign incidents
  const handleAssign = async () => {
    if (!selectedUser) return toast.warn("Please select a user first.");
    if (selectedIncidents.length === 0)
      return toast.warn("Please select at least one incident.");
    if (!loggedUserSid) return toast.error("Logged-in user SID not found.");

    const payload = {
      assigned_by_sid: loggedUserSid,
      assigned_to_sid: selectedUser,
      incident_sid: selectedIncidents,
    };

    try {
      const res = await api.post("/users/assign/incidents/", payload);
      toast.success("🎯 Incidents assigned successfully!");
      setSelectedIncidents([]);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      console.error("❌ Error assigning incidents:", error.response?.data || error);
      // toast.error("Failed to assign incidents.");
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Pending QA</h5>
        <div className="d-flex gap-2">
          <Form.Select
            size="sm"
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.sid} value={user.sid}>
                {user.full_name}
              </option>
            ))}
          </Form.Select>

          <Button
            size="sm"
            variant="primary"
            disabled={selectedIncidents.length === 0 || !selectedUser}
            onClick={handleAssign}
          >
            Assign
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th style={{ width: "65px" }}>
                <Form.Check
                  type="checkbox"
                  className="custom-checkbox"
                  checked={
                    pendingIncidents.length > 0 &&
                    selectedIncidents.length === pendingIncidents.length
                  }
                  onChange={handleSelectAll}
                />
                <span className="ms-1">Select All</span>
              </th>
              <th>Incident No</th>
               {/* <th style={{ width: "200px" }}>Short Description</th> */}
              <th>Handled By</th>
              <th>Handled On</th>
              <th>QC-Analyst</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingIncidents.length > 0 ? (
              pendingIncidents.map((incident, index) => (
                <tr key={incident.sid || index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      className="custom-checkbox"
                      checked={selectedIncidents.includes(incident.sid)}
                      onChange={() => handleSelectIncident(incident.sid)}
                    />
                  </td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => handleOpenModal(incident)}
                      style={{ padding: 0 }}
                    >
                      {incident.incident_number}
                    </Button>
                  </td>
                  {/* <td>{incident.short_description || "N/A"}</td> */}
                  <td>{incident.assigned_analyst}</td>
                  <td>{formatDate(incident.incident_date)}</td>
                  <td>{incident.qc_analyst || "NA"}</td>
                  <td>{incident.resolution_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No pending QA records found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal */}
  <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title className="fw-bold">Incident Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {formData && (
      <Form>
        {/* Incident Info */}
        <div className="mb-4 p-3 border rounded shadow-sm bg-light">
          <h6 className="fw-bold mb-3">Incident Information</h6>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Incident Number</Form.Label>
                <Form.Control
                  type="text"
                  name="incident_number"
                  value={formData.incident_number || ""}
                  readOnly
                  plaintext={false}
                  className="border border-secondary bg-light"
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group>
                <Form.Label className="fw-bold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="short_description"
                  value={formData.short_description || ""}
                  readOnly
                  className="border border-secondary bg-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Handled By</Form.Label>
                <Form.Control
                  type="text"
                  name="assigned_analyst"
                  value={formData.assigned_analyst || ""}
                  readOnly
                  className="border border-secondary bg-light"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Handled On</Form.Label>
                <Form.Control
                  type="date"
                  name="incident_date"
                  value={formatDate(formData.incident_date)}
                  readOnly
                  className="border border-secondary bg-light"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Current Status</Form.Label>
                <Form.Control
                  type="text"
                  name="resolution_status"
                  value={formData.resolution_status || ""}
                  readOnly
                  className="border border-secondary bg-light"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* QA Details */}
         {/* QA Details */}
 {/* Quality Check Points */}
<div className="mb-4 p-3 border rounded shadow-sm bg-light">
  <h6 className="fw-bold mb-3">Quality Check Points</h6>

  <Dropdown show={dropdownOpen} onToggle={() => setDropdownOpen(!dropdownOpen)}>
    <Dropdown.Toggle variant="secondary" id="dropdown-multi-checkbox">
      Select QA Comments ({selectedComments.length})
    </Dropdown.Toggle>

    <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {qualityPoints.map((item) => (
        <Form.Check
          key={item.sid}
          type="checkbox"
          id={`qa-${item.sid}`}
          label={`${item.check_point_name} (${item.point_value} pts)`}
          checked={!!selectedComments.find(c => c.sid === item.sid)}
          onChange={() => handleCommentToggle(item)}
          className="mx-3 my-1"
        />
      ))}
    </Dropdown.Menu>
  </Dropdown>

  <Form.Group className="mt-3">
    <Form.Label className="fw-bold">Total Score</Form.Label>
    <Form.Control
      type="number"
      value={totalScore}
      readOnly
      className="border border-secondary bg-light"
    />
  </Form.Group>
</div>




        {/* Grooming Section */}
        <div className="mb-4 p-3 border rounded shadow-sm bg-light">
          <h6 className="fw-bold mb-3">Grooming Details</h6>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Grooming Needed</Form.Label>
                <Form.Select
                  name="grooming_needed"
                  value={formData.grooming_needed ? "Yes" : "No"}
                  onChange={handleChange}
                  className="border border-secondary"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group>
                <Form.Label className="fw-bold">Grooming Instructions</Form.Label>
                <Form.Control
                  type="text"
                  name="grooming_instructions"
                  value={formData.grooming_instructions || ""}
                  onChange={handleChange}
                  className="border border-secondary"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Form>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button variant="success" onClick={handleUpdate}>
      Save
    </Button>
    <Button variant="outline-dark" onClick={handleCloseModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


    </div>
  );
};

export default PendingQATable;
