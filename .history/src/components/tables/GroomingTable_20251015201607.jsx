 import { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Row, Col, Spinner,Dropdown  } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import api from "../../api/axois";
import "../PendingQATable.css";
const GroomingTable = ({ incidents, loading }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIncidents, setSelectedIncidents] = useState([]);
   // QA state
    const [qualityPoints, setQualityPoints] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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


    // Fetch Quality Check Points
  useEffect(() => {
    const fetchQualityPoints = async () => {
      try {
        const res = await api.get("http://localhost:8000/api/users/quality-check-points");
        const points = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.results || [];
        setQualityPoints(points);
      } catch (error) {
        console.error("Error fetching quality points:", error.response?.data || error.message);
        toast.error("Failed to load quality check points!");
      }
    };
    fetchQualityPoints();
  }, []);

  // Handle QA checkbox toggle
  const handleCommentToggle = (comment) => {
    setSelectedComments((prev) => {
      let updated;
      if (prev.find((c) => c.sid === comment.sid)) {
        updated = prev.filter((c) => c.sid !== comment.sid);
      } else {
        updated = [...prev, comment];
      }
      const scoreSum = updated.reduce((sum, item) => sum + (item.point_value || 0), 0);
      setTotalScore(scoreSum);
      return updated;
    });
  };
  useEffect(() => {
  console.log("🟢 Auth user object:", user);
}, [user]);

  useEffect(() => {
  if (user && showModal) {
    setFormData((prev) => ({
      ...prev,
      qc_analyst: prev.qc_analyst || user.full_name,
    }));
    console.log("🔹 QA Agent set from user:", user.full_name);
  }
}, [user, showModal]);

 const scores = {};
selectedComments.forEach((item) => {
  scores[item.check_point_name] = item.point_value || 0;
});

  // Modal open/close
  const handleOpenModal = (incident) => {
  setSelectedIncident(incident);

  setFormData({
    ...incident,
    incident_sid: incident.sid,
    qc_analyst: user?.full_name || "",                  // QA Agent
    audit_date: incident.audit_date || new Date().toISOString().split("T")[0], // QA Done On
  });

  if (incident.qa_comment) {
    const selectedNames = incident.qa_comment.split(", ").map(name => name.trim());
    const preSelected = qualityPoints.filter(qp =>
      selectedNames.includes(qp.check_point_name)
    );
    setSelectedComments(preSelected);
    const scoreSum = preSelected.reduce(
      (sum, item) => sum + (item.point_value || 0),
      0
    );
    setTotalScore(scoreSum);
  } else {
    setSelectedComments([]);
    setTotalScore(0);
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


  // Format date to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr.split("T")[0];
    const parts = dateStr.split("/"); // DD/MM/YYYY
    if (parts.length !== 3) return "";
    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return date.toISOString().split("T")[0];
  };

   // Form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;

    if (name === "grooming_needed") {
      finalValue = value === "Yes";
    } else if (type === "checkbox") {
      finalValue = checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

   

   // Update API
  const handleUpdate = async () => {
   try {
     if (!formData.incident_sid || !formData.incident_number) {
       alert("Incident SID or Incident Number is missing!");
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
 
     alert(
       `Message: ${res.data.message}\nIncident IDs: ${res.data.incident_ids?.join(", ")}`
     );
 
     // ✅ Local removal: if resolved, remove from table immediately
     if (formData.resolution_status?.toLowerCase() === "resolved") {
       setLocalIncidents((prev) =>
         prev.filter((i) => i.sid !== formData.incident_sid)
       );
     }
 
     // ✅ Call refresh to stay in sync with backend
     if (typeof refresh === "function") {
       await refresh();
     }
 
     setShowModal(false);
   } catch (error) {
     console.error("❌ Error updating incident:", error.response?.data || error.message);
     alert(
       `Failed to update incident.\n\n${
         error.response?.data
           ? JSON.stringify(error.response.data, null, 2)
           : error.message
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

  const handleSelectAll = () => {
    if (selectedIncidents.length === pendingIncidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(pendingIncidents.map((i) => i.sid));
    }
  };

    // Assign incidents
  const handleAssign = async () => {
    if (!selectedUser) return alert("Please select a user first.");
    if (selectedIncidents.length === 0) return alert("Please select at least one incident.");
    if (!loggedUserSid) return alert("Unable to find logged-in user SID.");

    const payload = {
      assigned_by_sid: loggedUserSid,
      assigned_to_sid: selectedUser,
      incident_sid: selectedIncidents,
    };

    console.log("🚀 Assign payload:", payload);

    try {
      const res = await api.post("/users/assign/incidents/", payload); // ✅ with token
      console.log("✅ Assign response:", res.data);
      alert("Incidents assigned successfully!");
      setSelectedIncidents([]);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      console.error("❌ Error assigning incidents:", error.response?.data || error);
      // alert("Failed to assign incidents.");
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Pending Grooming</h5>

        {/* ✅ Assignment Controls */}
        {/* <div className="d-flex gap-2">
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
        </div> */}
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
                   className="custom-checkbox"
                  checked={
                    incidents.length > 0 &&
                    selectedIncidents.length === incidents.length
                  }
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
              incidents.map((incident, index) => (
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
                  <td className="short-desc-cell">
  <div className="short-desc-text" title={incident.short_description}>
    {incident.short_description || "N/A"}
  </div>
</td>

                  <td>{incident.assigned_analyst || "NA"}</td>
                  <td>{incident.incident_date || "NA"}</td>
                  <td>{incident.priority || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No grooming incidents found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* ✅ Modal */}
         {/* ✅ Modal */}
<Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title className="fw-bold">Incident Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {formData && (
      <Form>
        {/* Incident Information */}
         <div className="mb-4 p-3 border rounded shadow-sm bg-light">
           <h6 className="fw-bold mb-3">Incident Information</h6>
         
           <Row className="mb-3">
             <Col md={4}>
               <div className="info-field">
                 <span className="fw-bold me-2">Incident Number:</span>
                 <span>{formData.incident_number || "N/A"}</span>
               </div>
             </Col>
             <Col md={8}>
               <div className="info-field">
                 <span className="fw-bold me-2">Description:</span>
                 <span>{formData.short_description || "N/A"}</span>
               </div>
             </Col>
           </Row>
         
           <Row>
             <Col md={4}>
               <div className="info-field">
                 <span className="fw-bold me-2">Handled By:</span>
                 <span>{formData.assigned_analyst || "N/A"}</span>
               </div>
             </Col>
             <Col md={4}>
               <div className="info-field">
                 <span className="fw-bold me-2">Handled On:</span>
                 <span>{formatDate(formData.incident_date) || "N/A"}</span>
               </div>
             </Col>
             <Col md={4}>
               <div className="info-field">
                 <span className="fw-bold me-2">Current Status:</span>
                 <span>{formData.resolution_status || "N/A"}</span>
               </div>
             </Col>
           </Row>
         </div>
        
  {/* QA Details - READ ONLY as TEXT */}
<div className="mb-4 p-3 border rounded shadow-sm bg-light">
  <h6 className="fw-bold mb-3">QA Details</h6>

  <Row className="mb-2">
    <Col md={4}>
      <div className="info-field">
        <span className="fw-bold me-2">QA Status:</span>
        <span>{formData.qa_status || "N/A"}</span>
      </div>
    </Col>
    <Col md={4}>
      <div className="info-field">
        <span className="fw-bold me-2">QA Done On:</span>
        <span>{formatDate(formData.audit_date) || "N/A"}</span>
      </div>
    </Col>
    <Col md={4}>
      <div className="info-field">
        <span className="fw-bold me-2">QA Agent:</span>
        <span>{formData.qc_analyst || user?.full_name || user?.name || "N/A"}</span>
      </div>
    </Col>
  </Row>

  <Row className="mt-3">
     <Col md={8}>
  <div className="info-field">
    <span className="fw-bold me-2">QA Comments:</span>

    {/* Render each score comment */}
    {formData?.scores && Object.keys(formData.scores).length > 0 ? (
      <ul className="mb-0 ps-3">
        {Object.entries(formData.scores).map(([key, value], idx) => (
          <li key={idx}>
            <strong>{key}</strong>: {value.description || "No comment"} (
            Score: {value.point_value})
          </li>
        ))}
      </ul>
    ) : (
      <span>N/A</span>
    )}
  </div>
</Col>


    <Col md={4}>
      <div className="info-field">
        <span className="fw-bold me-2">Total Score:(
            Score: {value.point_value})</span>
        <span>{totalScore}</span>
      </div>
    </Col>
  </Row>
</div>



        {/* Grooming Details */}
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

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Grooming Done</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="grooming_done"
                  checked={!!formData.grooming_done}
                  onChange={handleChange}
                  label="Mark as Done"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">KBA Resolution Updated</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="kba_resolution_updated"
                  checked={!!formData.kba_resolution_updated}
                  onChange={handleChange}
                  label="Yes"
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

export default GroomingTable;
