 import { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import api from "../../api/axois";

const UnassignedTable = ({ incidents, loading }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIncidents, setSelectedIncidents] = useState([]);

  const { user } = useAuth();
  const loggedUserSid = user?.user_sid;

  // ✅ Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("http://localhost:8000/api/users/get/list_users");
        setUsers(res.data || []);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Modal Handlers
  const handleOpenModal = (incident) => {
    setSelectedIncident(incident);
    setFormData(incident);
    setShowModal(true);
    setIsEditing(false);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
    setIsEditing(false);
  };

  // ✅ Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleUpdate = () => {
    console.log("✅ Updated Unassigned Data:", formData);
    // TODO: API call for update
    setIsEditing(false);
    setShowModal(false);
  };

  // ✅ Checkbox Select
  const handleSelectIncident = (incidentSid) => {
    setSelectedIncidents((prev) =>
      prev.includes(incidentSid)
        ? prev.filter((id) => id !== incidentSid)
        : [...prev, incidentSid]
    );
  };
  const handleSelectAll = () => {
    if (selectedIncidents.length === incidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(incidents.map((i) => i.sid));
    }
  };

  // ✅ Assign Handler
  const handleAssign = async () => {
    if (!selectedUser) {
      alert("⚠️ Please select a user first.");
      return;
    }
    if (selectedIncidents.length === 0) {
      alert("⚠️ Please select at least one incident.");
      return;
    }
    if (!loggedUserSid) {
      alert("⚠️ Unable to find logged-in user SID. Please re-login.");
      return;
    }

    const payload = {
      assigned_by_sid: loggedUserSid,
      assigned_to_sid: selectedUser,
      incident_sid: selectedIncidents,
    };

    try {
      const res = await api.post(
        "http://localhost:8000/api/users/assign/incidents/",
        payload
      );
      console.log("✅ Assign Response:", res.data);
      alert("Unassigned incidents successfully assigned!");
      setSelectedIncidents([]);
      setSelectedUser(null);
    } catch (error) {
      console.error("❌ Error assigning incidents:", error);
      alert("Failed to assign unassigned incidents.");
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Unassigned Incidents</h5>

        {/* ✅ Assignment Controls */}
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
        <div className="text-center py-5">
          {/* <Spinner animation="border" variant="primary" /> */}
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
               <th style={{ width: "65px" }}> 
                <Form.Check
                  type="checkbox"
                  checked={
                    incidents.length > 0 &&
                    selectedIncidents.length === incidents.length
                  }
                  onChange={handleSelectAll}
                  
                    
                />
                <span className="ms-1">Select All</span>
              </th>
              <th>Incident No</th>
              <th>Incident Date</th>
              <th>Short Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <tr key={incident.sid || index}>
                  <td>
                    <Form.Check
                      type="checkbox"
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
                  <td>{incident.incident_date}</td>
                  <td className="text-truncate" style={{ maxWidth: "200px" }}>
                    {incident.short_description || "N/A"}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs fw-semibold ${
                        incident.resolution_status === "on hold"
                          ? "bg-warning-subtle text-warning"
                          : "bg-danger-subtle text-danger"
                      }`}
                    >
                      {incident.resolution_status || "Unassigned"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No unassigned incidents found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* ✅ Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title><b>Unassigned Incident Details</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><b>Incident #</b></Form.Label>
                <Form.Control
                  type="text"
                  name="incident_number"
                  value={formData.incident_number || ""}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><b>Description</b></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="short_description"
                  value={formData.short_description || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label><b>Status</b></Form.Label>
                    <Form.Control
                      type="text"
                      name="resolution_status"
                      value={formData.resolution_status || ""}
                      readOnly={!isEditing}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label><b>Incident Date</b></Form.Label>
                    <Form.Control
                      type="text"
                      name="incident_date"
                      value={formData.incident_date || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
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
    </div>
  );
};

export default UnassignedTable;
