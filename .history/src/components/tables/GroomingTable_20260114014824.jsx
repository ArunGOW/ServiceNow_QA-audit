 import { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Row, Col, Spinner, Dropdown } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import api from "../../api/axois";
import { ToastContainer, toast } from "react-toastify";
import logger from "../../utils/logger";
import "../PendingQATable.css";
import "../GrommingQATable.css";
const GroomingTable = ({ incidents, loading, refresh }) => {
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
        const res = await api.get("/users/get/list_users");
        setUsers(res.data || []);
      } catch (error) {
        logger.error("❌ Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  // 🔹 Auto-calculate total score whenever formData.scores or selectedComments changes
  useEffect(() => {
    if (selectedComments && selectedComments.length > 0) {
      // When user manually selects QA comments
      const total = selectedComments.reduce(
        (sum, item) => sum + (Number(item.point_value) || 0),
        0
      );
      setTotalScore(total);
    } else if (formData?.scores && Object.keys(formData.scores).length > 0) {
      // When QA comments are loaded from backend
      const total = Object.values(formData.scores).reduce(
        (sum, val) => sum + (Number(val.point_value) || 0),
        0
      );
      setTotalScore(total);
    } else {
      setTotalScore(0);
    }
  }, [selectedComments, formData]);


  // Fetch Quality Check Points
  useEffect(() => {
    const fetchQualityPoints = async () => {
      try {
        const res = await api.get("/users/quality-check-points");
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
  logger.info("🟢 Auth user object:", user);
  
  }, [user]);

  useEffect(() => {
    if (user && showModal) {
      setFormData((prev) => ({
        ...prev,
        qc_analyst: prev.qc_analyst || user.full_name,
      }));
      logger.info("🔹 QA Agent set from user:", user.full_name);
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



  


  // Select incidents
  
  const handleUpdate = async () => {
       if (!formData?.incident_sid) {
        logger.warn("Incident SID missing in update");
        return toast.warn("Incident SID missing!");
      }
    
      // 1. Initialize the scores object with ALL available categories set to 0
      const scoresPayload = qualityPoints.reduce((acc, cat) => {
        const categoryKey = cat.check_point_name.toLowerCase().replace(/\s+/g, '_');
        
        // Create the base structure for every category found in your points list
        acc[categoryKey] = {
          total: 0,
          sub_scores: (cat.sub_categories || []).reduce((subAcc, sub) => {
            const subKey = sub.sub_check_point_name.toLowerCase().replace(/\s+/g, '_');
            subAcc[subKey] = 0; // Default all sub-scores to 0
            return subAcc;
          }, {})
        };
        return acc;
      }, {});
    
      // 2. Fill in the actual selected values
      selectedComments.forEach((item) => {
        const categoryKey = item.parent_name.toLowerCase().replace(/\s+/g, '_');
        const subKey = item.sub_check_point_name.toLowerCase().replace(/\s+/g, '_');
    
        if (scoresPayload[categoryKey]) {
          scoresPayload[categoryKey].sub_scores[subKey] = item.max_points;
          scoresPayload[categoryKey].total += (item.max_points || 0);
        }
      });
    
      // 3. Add the final total summary key
      scoresPayload.total_score_achieved = totalScore;
  try {
 const payload = [
  {
    incident_sid: formData.incident_sid,
    incident_number: formData.incident_number,
    incident_date: formatDate(formData.incident_date),
    short_description: formData.short_description,
    resolution_status: formData.resolution_status,
    resolution_shared: formData.resolution_shared,
    updates_link: formData.updates_link,
    notes: formData.notes,
    assigned_analyst: formData.assigned_analyst,
  qc_analyst: user?.full_name || user?.name,

    is_audited: true,
    audit_status: "done",
    audit_date: new Date().toISOString(),
    rca_done: !!formData.rca_done,
    grooming_needed: !!formData.grooming_needed,
    grooming_done: true,
    kba_resolution_needed: !!formData.kba_resolution_needed,
    kba_resolution_updated: !!formData.kba_resolution_updated,
    scores: scoresPayload,
    updated_at: new Date().toISOString(),
  },
];


    

    // // 1️⃣ First API call - fail edit
    // await api.post("/users/user/fail-edit", payload);

    // 2️⃣ Second API call - update incident status
    await api.post("/users/update/incident-status", payload);

    // Toast message after both API calls succeed
    toast.success("Incident updated successfully!");

    // Refresh table
    if (typeof refresh === "function") refresh();

    // Close modal
    setShowModal(false);

  } catch (error) {
    console.error("Update error:", error);
    toast.error("Failed to update incident!");
  }
};

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

    logger.info("🚀 Assign payload:", payload);
    console.log("USER OBJECT:", user);

    try {
      const res = await api.post("/users/assign/incidents/", payload); // ✅ with token
      logger.info("✅ Assign response:", res.data);
      alert("Incidents assigned successfully!");
      setSelectedIncidents([]);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      logger.error("❌ Error assigning incidents:", error.response?.data || error);
      // alert("Failed to assign incidents.");
    }
  };



  return (
//     <div className="bg-white rounded shadow-sm p-3">
//       <div className="d-flex justify-content-center align-items-center mb-3">
//         <h5 className="fw-bold">Pending Grooming</h5>

//         {/* ✅ Assignment Controls */}
//         {/* <div className="d-flex gap-2">
//           <Form.Select
//             size="sm"
//             value={selectedUser || ""}
//             onChange={(e) => setSelectedUser(e.target.value)}
//           >
//             <option value="">-- Select User --</option>
//             {users.map((user) => (
//               <option key={user.sid} value={user.sid}>
//                 {user.full_name}
//               </option>
//             ))}
//           </Form.Select>

   
//           <Button
//             size="sm"
//             variant="primary"
//             disabled={selectedIncidents.length === 0 || !selectedUser}
//             onClick={handleAssign}
//           >
//             Assign
//           </Button>
//         </div> */}
//       </div>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <Table bordered hover responsive className="align-middle text-center">
//           <thead className="table-light">
//             <tr>
//               <th style={{ width: "65px" }}>
//                 <Form.Check
//                   type="checkbox"
//                   className="custom-checkbox"
//                   checked={
//                     incidents.length > 0 &&
//                     selectedIncidents.length === incidents.length
//                   }
//                   onChange={handleSelectAll}
//                 />

//                 <span className="ms-1">Select All</span>
//               </th>
//               <th>Incident No</th>
//               <th>Short Description</th>
//                <th>Handled On</th>
//               <th>Handled By</th>
//               <th>QC Date</th>
//               <th>QC-Analyst</th>
//             </tr>
//           </thead>
//           <tbody>
//             {incidents.length > 0 ? (
//               incidents.map((incident, index) => (
//                 <tr key={incident.sid || index}>
//                   <td>
//                     <Form.Check
//                       type="checkbox"
//                       className="custom-checkbox"
//                       checked={selectedIncidents.includes(incident.sid)}
//                       onChange={() => handleSelectIncident(incident.sid)}
//                     />
//                   </td>
//                   <td>
//                     <Button
//                       variant="link"
//                       onClick={() => handleOpenModal(incident)}
//                       style={{ padding: 0 }}
//                     >
//                       {incident.incident_number}
//                     </Button>
//                   </td>
//                   <td className="short-desc-cell">
//                     <div className="short-desc-text" title={incident.short_description}>
//                       {incident.short_description || "N/A"}
//                     </div>
//                   </td>
//                    <td>{incident.incident_date || "NA"}</td>

//                   <td>
//                     {incident.assigned_analyst
//                       ? incident.assigned_analyst
//                         .split(" ")
//                         .map(
//                           (word) =>
//                             word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//                         )
//                         .join(" ")
//                       : "N/A"}
//                   </td>

//                   <td>{formatDate(incident.updated_at) || "N/A"}</td>
//                   <td>
//                     {incident.qc_analyst
//                       ? incident.qc_analyst.charAt(0).toUpperCase() +
//                       incident.qc_analyst.slice(1).toLowerCase()
//                       : "NA"}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5">No grooming incidents found.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* ✅ Modal */}
//       {/* ✅ Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title className="fw-bold d-flex justify-content-center align-items-center ">Incident Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {formData && (
//             <Form>
//               {/* Incident Information */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">Incident Information</h6>

//                 <Row className="mb-3">
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">Incident Number:</span>
//                       <span>{formData.incident_number || "N/A"}</span>
//                     </div>
//                   </Col>
//                   <Col md={8}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">Description:</span>
//                       <span>{formData.short_description || "N/A"}</span>
//                     </div>
//                   </Col>
//                 </Row>

//                 <Row>
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">Handled By:</span>
//                       <span>
//                         {formData.assigned_analyst
//                           ? formData.assigned_analyst.charAt(0).toUpperCase() +
//                           formData.assigned_analyst.slice(1).toLowerCase()
//                           : "N/A"}
//                       </span>

//                     </div>
//                   </Col>
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">Handled On:</span>
//                       <span>{formatDate(formData.incident_date) || "N/A"}</span>
//                     </div>
//                   </Col>
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">Current Status:</span>
//                       <span>{formData.resolution_status || "N/A"}</span>
//                     </div>
//                   </Col>
//                 </Row>
//               </div>

//               {/* QA Details - READ ONLY as TEXT */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">QA Details</h6>

//                 <Row className="mb-2">
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">QA Status:</span>
//                       <span
//                         className={`badge rounded-pill px-3 py-2 fs-6 text-white ${formData.qa_status === "Pass"
//                             ? "bg-success"
//                             : formData.qa_status === "Fail"
//                               ? "bg-danger"
//                               : "bg-secondary"
//                           }`}
//                       >
//                         {formData.qa_status || "N/A"}
//                       </span>
//                     </div>

//                   </Col>
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">QA Done On:</span>
//                       <span className="text-white">{formatDate(formData.audit_date) || "N/A"}</span>
//                     </div>
//                   </Col>
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">QA Agent:</span>
//                       <span>{formData.qc_analyst || user?.full_name || user?.name || "N/A"}</span>
//                     </div>
//                   </Col>
//                 </Row>

//                 <Row className="mt-3 align-items-start">
//                   <Col md={8}>
//                     <div className="info-field d-flex flex-column">
//                       <span className="fw-bold me-2 mb-1">QA Comments:</span>
//                       {formData?.scores && Object.keys(formData.scores).length > 0 ? (
//                         <div className="qa-comments-list">
//                           {Object.entries(formData.scores).map(([key, value], idx) => (
//                             <div key={idx} className="qa-comment-item">
//                               <strong>{key}:</strong> {value.description} (Score: {value.point_value})
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <span>N/A</span>
//                       )}
//                     </div>
//                   </Col>

//                   <Col md={4} className="text-end">
//                     <div className="info-field fw-semibold">
//                       <span className="fw-bold me-2">Total Score:</span>
//                       <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
//                         {totalScore || 0}
//                       </span>

//                     </div>
//                   </Col>
//                 </Row>

//               </div>



//               {/* Grooming Details */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">Grooming Details</h6>

//                 <Row className="mb-3">
//                   <Col md={4}>
//       <Form.Group>
//         <Form.Label className="fw-bold">
//           Grooming Done <span className="text-danger">*</span>
//         </Form.Label>
//         <Form.Check
//           type="checkbox"
//           name="grooming_done"
//           checked={!!formData.grooming_done}
//           onChange={handleChange}
//           label="Mark as Done"
//           isInvalid={!formData.grooming_done} // red border if not checked
//         />
//         <Form.Control.Feedback type="invalid">
//           Grooming must be marked as done to continue.
//         </Form.Control.Feedback>
//       </Form.Group>
//     </Col>

//                   <Col md={8}>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">Grooming Instructions</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="grooming_instructions"
//                         value={formData.grooming_instructions || ""}
//                         onChange={handleChange}
//                         className="border border-secondary"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row>
                  
//                   <Col md={12}>
//            <Form.Group>
//   <Form.Label className="fw-bold">
//     Audit Notes / Observations <span className="text-danger">*</span>
//   </Form.Label>
//   <Form.Control
//     as="textarea"
//     rows={3}
//     name="notes"
//     required // Added browser-level hint
//     isInvalid={formData.notes === ""} // Optional: turns border red if empty
//     placeholder="Enter detailed feedback (Mandatory)..."
//     value={formData.notes || ""}
//     onChange={handleChange}
//   />
//   <Form.Control.Feedback type="invalid">
//     Notes are required to complete the audit.
//   </Form.Control.Feedback>
// </Form.Group>
//                   </Col>
//                 </Row>
//               </div>
//             </Form>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="success" onClick={handleUpdate}>
//             Save
//           </Button>
//           <Button variant="outline-dark" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <ToastContainer />


//     </div>

 <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
  {/* ✅ Header with Ultra-Lite Gradient */}
  <div className="premium-lite-banner d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
    <div className="d-flex align-items-center">
      <div className="header-accent-pill me-3"></div>
      <div>
        <h5 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.2px', fontSize: '1.25rem' }}>
          Pending Grooming
        </h5>
        <div className="d-flex align-items-center mt-1">
          <small className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>
            Quality Assurance & Assessment Queue
          </small>
        </div>
      </div>
    </div>

    {/* ✅ Attractive Count Pill */}
    <div className="modern-count-badge">
      <span className="badge-text">TOTAL LIST</span>
      <span className="badge-number">{incidents.length}</span>
    </div>
  </div>

  {loading ? (
    <div className="text-center py-5">
      <Spinner animation="border" size="sm" variant="primary" />
    </div>
  ) : (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0 refined-table">
        <thead>
          <tr>
            <th style={{ width: "50px" }} className="ps-4">
              <Form.Check
                type="checkbox"
                className="custom-check"
                checked={incidents.length > 0 && selectedIncidents.length === incidents.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>INCIDENT NO</th>
            <th>DESCRIPTION</th>
            <th>HANDLED ON</th>
            <th>HANDLED BY</th>
            <th>QC DATE</th>
            <th>QC ANALYST</th>
          </tr>
        </thead>
        <tbody>
          {incidents.length > 0 ? (
            incidents.map((incident, index) => (
              <tr key={incident.sid || index}>
                <td className="ps-4">
                  <Form.Check
                    type="checkbox"
                    className="custom-check"
                    checked={selectedIncidents.includes(incident.sid)}
                    onChange={() => handleSelectIncident(incident.sid)}
                  />
                </td>
                {/* ✅ Increased Font Size for Incident No */}
                <td>
                  <span 
                    className="incident-link fw-bold text-primary cursor-pointer"
                    onClick={() => handleOpenModal(incident)}
                  >
                    {incident.incident_number}
                  </span>
                </td>
                {/* ✅ Medium Font for Description */}
                <td>
                  <div className="description-text text-secondary" title={incident.short_description}>
                    {incident.short_description || "—"}
                  </div>
                </td>
                <td><span className="date-text">{incident.incident_date || "—"}</span></td>
                <td>
                  <span className="analyst-name">
                    {incident.assigned_analyst || "N/A"}
                  </span>
                </td>
                <td><span className="date-text">{formatDate(incident.updated_at) || "—"}</span></td>
                <td>
                   <div className="d-flex align-items-center">
                      <div className="avatar-mini me-2">{incident.qc_analyst?.charAt(0) || "U"}</div>
                      <span className="qc-name">{incident.qc_analyst || "NA"}</span>
                   </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" className="text-center py-5 text-muted">No grooming records available.</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  )}

        {/* ✅ Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fw-bold d-flex justify-content-center align-items-center ">Incident Details</Modal.Title>
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
                      <span>
                        {formData.assigned_analyst
                          ? formData.assigned_analyst.charAt(0).toUpperCase() +
                          formData.assigned_analyst.slice(1).toLowerCase()
                          : "N/A"}
                      </span>

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
                      <span
                        className={`badge rounded-pill px-3 py-2   text-white ${formData.qa_status === "Pass"
                            ? "bg-success"
                            : formData.qa_status === "Fail"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                      >
                        {formData.qa_status || "N/A"}
                      </span>
                    </div>

                  </Col>
                  <Col md={4}>
                    <div className="info-field">
                      <span className="fw-bold me-2">QA Done On:</span>
                      <span className="text-white">{formatDate(formData.audit_date) || "N/A"}</span>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="info-field">
                      <span className="fw-bold me-2">QA Agent:</span>
                      <span>{formData.qc_analyst || user?.full_name || user?.name || "N/A"}</span>
                    </div>
                  </Col>
                </Row>

                {/* <Row className="mt-3 align-items-start">
                  <Col md={8}>
                    <div className="info-field d-flex flex-column">
                      <span className="fw-bold me-2 mb-1">QA Comments:</span>
                      {formData?.scores && Object.keys(formData.scores).length > 0 ? (
                        <div className="qa-comments-list">
                          {Object.entries(formData.scores).map(([key, value], idx) => (
                            <div key={idx} className="qa-comment-item">
                              <strong>{key}:</strong> {value.description} (Score: {value.point_value})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </Col>

                  <Col md={4} className="text-end">
                    <div className="info-field fw-semibold">
                      <span className="fw-bold me-2">Total Score:</span>
                      <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
                        {totalScore || 0}
                      </span>

                    </div>
                  </Col>
                </Row> */}
                <Row className="mt-3 align-items-start">
  <Col md={8}>
    <div className="info-field d-flex flex-column">
      <span className="fw-bold me-2 mb-2">QA Comments (Scores per Category):</span>
      {formData?.scores ? (
        <div className="qa-comments-list">
          {Object.entries(formData.scores).map(([key, value], idx) => {
            // Skip the total_score_achieved key so it doesn't list as a comment
            if (key === "total_score_achieved") return null;

            return (
              <div key={idx} className="qa-comment-item mb-1 d-flex align-items-center">
                <div className="category-accent me-2"></div>
                <span className="text-capitalize text-dark fw-medium">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="ms-2 badge bg-light text-primary border">
                   Score: {value.total || 0}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-muted">N/A</span>
      )}
    </div>
  </Col>

  <Col md={4} className="text-end">
    <div className="info-field fw-semibold">
      <span className="fw-bold me-2 d-block mb-1 text-muted small text-white">TOTAL ACHIEVED</span>
      <span className="badge bg-primary rounded-pill px-4 py-2   shadow-sm">
        {/* Accessing the total from the specific API key */}
        {formData?.scores?.total_score_achieved ?? 0}
      </span>
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
        <Form.Label className="fw-bold">
          Grooming Done <span className="text-danger">*</span>
        </Form.Label>
        <Form.Check
          type="checkbox"
          name="grooming_done"
          checked={!!formData.grooming_done}
          onChange={handleChange}
          label="Mark as Done"
          isInvalid={!formData.grooming_done} // red border if not checked
        />
        <Form.Control.Feedback type="invalid">
          Grooming must be marked as done to continue.
        </Form.Control.Feedback>
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
                  
                  <Col md={12}>
           <Form.Group>
  <Form.Label className="fw-bold">
    Audit Notes / Observations <span className="text-danger">*</span>
  </Form.Label>
  <Form.Control
    as="textarea"
    rows={3}
    name="notes"
    required // Added browser-level hint
    isInvalid={formData.notes === ""} // Optional: turns border red if empty
    placeholder="Enter detailed feedback (Mandatory)..."
    value={formData.notes || ""}
    onChange={handleChange}
  />
  <Form.Control.Feedback type="invalid">
    Notes are required to complete the audit.
  </Form.Control.Feedback>
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
      <ToastContainer />
</div>

 
  );
};

export default GroomingTable;




 