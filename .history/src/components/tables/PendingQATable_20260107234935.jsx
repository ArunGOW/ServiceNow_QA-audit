
// import { Table, Modal, Button, Form, Row, Col, Dropdown, Spinner } from "react-bootstrap";
// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/axois";
// import "../PendingQATable.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logger from "../../utils/logger";

// const PendingQATable = ({ incidents, loading, refresh }) => {
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [selectedIncidents, setSelectedIncidents] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const { user } = useAuth();
//   const loggedUserSid = user?.user_sid;

//   // QA state
//   const [qualityPoints, setQualityPoints] = useState([]);
//   const [selectedComments, setSelectedComments] = useState([]);
//   const [totalScore, setTotalScore] = useState(0);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // Fetch users/agents
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoadingUsers(true);
//         const res = await api.get("/users/get/list_users");
        
//         console.log("🧩 Agents API Response:", res.data);
//         setUsers(res.data || []);
//       } catch (error) {
//         console.error("❌ Error fetching users:", error.response?.data || error.message);
//         toast.error("Failed to load agents list!");
//       } finally {
//         setLoadingUsers(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // Fetch Quality Check Points
//   useEffect(() => {
//     const fetchQualityPoints = async () => {
//       try {
//         const res = await api.get("/users/quality-check-points");
//         console.log("🔍 Quality Check Points Response:", res.data);

//         const points = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || res.data?.results || [];
//         setQualityPoints(points);
//       } catch (error) {
//         console.error("❌ Error fetching quality points:", error.response?.data || error.message);
//         toast.error("Failed to load quality check points!");
//       }
//     };
//     fetchQualityPoints();
//   }, []);

//   // Toggle QA comments selection
//   const handleCommentToggle = (comment) => {
//     setSelectedComments((prev) => {
//       let updated;
//       if (prev.find((c) => c.sid === comment.sid)) {
//         updated = prev.filter((c) => c.sid !== comment.sid);
//       } else {
//         updated = [...prev, comment];
//       }
//       const scoreSum = updated.reduce((sum, item) => sum + (item.point_value || 0), 0);
//       setTotalScore(scoreSum);
//       return updated;
//     });
//   };

//   // Open modal and prefill data
//   const handleOpenModal = (incident) => {
//     setSelectedIncident(incident);
//     setFormData({
//       ...incident,
//       incident_sid: incident.sid,
//       qc_analyst: user?.full_name || "",
//       audit_date: incident.audit_date || new Date().toISOString().split("T")[0],
//     });

//     if (incident.qa_comment) {
//       const selectedNames = incident.qa_comment.split(", ").map((name) => name.trim());
//       const preSelected = qualityPoints.filter((qp) => selectedNames.includes(qp.check_point_name));
//       setSelectedComments(preSelected);
//       const scoreSum = preSelected.reduce((sum, item) => sum + (item.point_value || 0), 0);
//       setTotalScore(scoreSum);
//     } else {
//       setSelectedComments([]);
//       setTotalScore(0);
//     }

//     setShowModal(true);
//   };

//   // Close modal and reset
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedIncident(null);
//     setFormData({});
//     setSelectedComments([]);
//     setTotalScore(0);
//   };

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let finalValue = value;
//     if (name === "grooming_needed") finalValue = value === "Yes";
//     else if (type === "checkbox") finalValue = checked;
//     setFormData((prev) => ({ ...prev, [name]: finalValue }));
//   };

//   // Format date to YYYY-MM-DD
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     if (dateStr.includes("-")) return dateStr.split("T")[0];
//     const parts = dateStr.split("/");
//     if (parts.length !== 3) return "";
//     const [day, month, year] = parts.map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.toISOString().split("T")[0];
//   };

//   // Update incident via API
//   const handleUpdate = async () => {
//     if (!formData?.incident_sid) return toast.warn("Incident SID missing!");

//     const payload = [
//       {
//         incident_sid: formData.incident_sid,
//         incident_number: formData.incident_number || selectedIncident.incident_number,
//         incident_date: formatDate(formData.incident_date) || selectedIncident.incident_date,
//         short_description: formData.short_description ?? selectedIncident.short_description,
//         resolution_status: formData.resolution_status ?? selectedIncident.resolution_status,
//         resolution_shared: formData.resolution_shared ?? selectedIncident.resolution_shared,
//         updates_link: formData.updates_link ?? selectedIncident.updates_link,
//         notes: formData.notes ?? selectedIncident.notes,
//         escalated_to_team: formData.escalated_to_team ?? selectedIncident.escalated_to_team,
//         assigned_analyst: formData.assigned_analyst ?? selectedIncident.assigned_analyst,
//         qc_analyst: selectedIncident.qc_analyst,
//         is_audited: formData.is_audited ?? selectedIncident.is_audited ?? true,
//         audit_status: formData.audit_status ?? selectedIncident.audit_status ?? "done",
//         audit_date: new Date().toISOString(),
//         qa_status: formData.qa_status ?? selectedIncident.qa_status ?? "",
//         rca_done: formData.rca_done ?? selectedIncident.rca_done ?? false,
//         grooming_needed: formData.grooming_needed ?? selectedIncident.grooming_needed ?? false,
//         grooming_done: formData.grooming_done ?? selectedIncident.grooming_done ?? false,
//         kba_resolution_needed:
//           formData.kba_resolution_needed ?? selectedIncident.kba_resolution_needed ?? false,
//         kba_resolution_updated:
//           formData.kba_resolution_updated ?? selectedIncident.kba_resolution_updated ?? false,
//         updated_at: new Date().toISOString(),
//         scores: selectedComments.reduce((acc, item) => {
//           acc[item.check_point_name] = {
//             description: item.check_point_description,
//             point_value: item.point_value,
//           };
//           return acc;
//         }, {}),
//       },
//     ];

//     try {
//       const res = await api.post("/users/update/incident-status", payload);
//       console.log("✅ Update Incident Response:", res.data);
//       toast.success(res.data.message || "Incident updated successfully");
//       handleCloseModal();
//       if (typeof refresh === "function") refresh();
//     } catch (error) {
//       console.error("❌ Error updating incident:", error.response?.data || error.message);
//       toast.error("Failed to update incident");
//     }
//   };

//   return (
//     <div className="bg-white rounded shadow-sm p-3">
//       <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
//       <div className="d-flex justify-content-center align-items-center mb-3">
//         <h5 className="fw-bold">Pending QA</h5>
//       </div>

//       {loading ? (
//         <div className="text-center py-5">Loading...</div>
//       ) : (
//         <Table bordered hover responsive className="align-middle text-center">
//           <thead className="table-light">
//             <tr>
//               <th style={{ width: "65px" }}>
//                 <Form.Check
//                   type="checkbox"
//                   className="custom-checkbox"
//                   checked={selectedIncidents.length === incidents.length && incidents.length > 0}
//                   onChange={(e) => {
//                     if (e.target.checked) setSelectedIncidents(incidents.map((i) => i.sid));
//                     else setSelectedIncidents([]);
//                   }}
//                 />
//                 <span className="ms-1">Select All</span>
//               </th>
//               <th>Incident No</th>
//               <th>Short Description</th>
//               <th>Handled By</th>
//               <th>Handled On</th>
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
//                       onChange={() =>
//                         setSelectedIncidents((prev) =>
//                           prev.includes(incident.sid)
//                             ? prev.filter((id) => id !== incident.sid)
//                             : [...prev, incident.sid]
//                         )
//                       }
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
//                   <td className="text-truncate" style={{ maxWidth: "300px" }}>
//                     {incident.short_description || "N/A"}
//                   </td>
//                   <td>
//                     {incident.assigned_analyst
//                       ? incident.assigned_analyst
//                         .toLowerCase()
//                         .replace(/\b\w/g, (char) => char.toUpperCase())
//                       : "N/A"}
//                   </td>

//                   <td>{formatDate(incident.incident_date)}</td>
//                   <td>
//                     {incident.qc_analyst
//                       ? incident.qc_analyst
//                         .split(" ")
//                         .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//                         .join(" ")
//                       : "NA"}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6">No incidents found.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title className="fw-bold">Incident Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {formData && (
//             <Form>
//               {/* Incident Info */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">Incident Information</h6>
//                 <Row>
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
//                 <Row className="mt-3">
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2 d-block text-nowrap">Handled By:</span>
//                       {loadingUsers ? (
//                         <Spinner animation="border" size="sm" />
//                       ) : (
//                         <Form.Select
//                           value={formData.assigned_analyst || ""}
//                           onChange={(e) =>
//                             setFormData({ ...formData, assigned_analyst: e.target.value })
//                           }
//                           className="custom-dropdown"
//                         >
//                           <option value="">Select Agent</option>
//                           {users.map((agent, index) => (
//                             <option key={index} value={agent.full_name}>
//                               {agent.full_name
//                                 ? agent.full_name.charAt(0).toUpperCase() +
//                                 agent.full_name.slice(1).toLowerCase()
//                                 : "Unknown"}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       )}
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

//               {/* QA Details */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">QA Details</h6>
//                 <Row className="mb-3">
//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">QA Status</Form.Label>
//                       <Form.Select
//                         name="qa_status"
//                         value={formData.qa_status || ""}
//                         onChange={handleChange}
//                         className="custom-dropdown"
//                       >
//                         <option value="">-- Select QA Status --</option>
//                         <option value="pass">Pass</option>
//                         <option value="fail">Fail</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">QA Done On</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="audit_date"
//                         value={formatDate(formData.audit_date)}
//                         readOnly
//                         className="border border-secondary bg-light"
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">QA Agent</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="qc_analyst"
//                         value={formData.qc_analyst || user?.full_name || user?.name || ""}
//                         readOnly
//                         className="border border-secondary bg-light"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* QA Comments Dropdown + Total Score */}
//                 <Row className="align-items-end">
//                   <Col md={8}>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">QA Comments</Form.Label>
//                       <Dropdown
//                         show={dropdownOpen}
//                         onToggle={() => setDropdownOpen(!dropdownOpen)}
//                       >
//                         <Dropdown.Toggle
//                           variant="secondary"
//                           className="d-flex justify-content-between align-items-center w-100 custom-dropdown"
//                           style={{
//                             whiteSpace: "normal",
//                             wordBreak: "break-word",
//                             textAlign: "left",
//                             minHeight: "38px",
//                           }}
//                         >
//                           <span>
//                             {selectedComments.length > 0
//                               ? selectedComments.map((c) => c.check_point_name).join(", ")
//                               : "Select QA Comments"}
//                           </span>
//                         </Dropdown.Toggle>

//                         <Dropdown.Menu
//                           style={{ maxHeight: "200px", overflowY: "auto", width: "100%" }}
//                         >
//                           {qualityPoints.map((item) => (
//                             <Form.Check
//                               key={item.sid}
//                               type="checkbox"
//                               id={`qa-${item.sid}`}
//                               label={`${item.check_point_name} (${item.point_value} pts)`}
//                               checked={!!selectedComments.find((c) => c.sid === item.sid)}
//                               onChange={() => handleCommentToggle(item)}
//                               className="mx-3 my-1 custom-checkbox"
//                             />
//                           ))}
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </Form.Group>
//                   </Col>

//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">Total Score</Form.Label>
//                       <Form.Control
//                         type="number"
//                         value={totalScore}
//                         readOnly
//                         className="border border-secondary bg-light"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </div>

//               {/* Grooming Section */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">Grooming Details</h6>
//                 <Row className="mb-3">
//                   <Col md={4}>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">Grooming Needed</Form.Label>
//                       <Form.Select
//                         name="grooming_needed"
//                         value={formData.grooming_needed ? "Yes" : "No"}
//                         onChange={handleChange}
//                         className="custom-dropdown"
//                       >
//                         <option value="No">No</option>
//                         <option value="Yes">Yes</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
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
//                   <Row className="mt-3">
//                     <Col md={6}>
//                       <Form.Group>
//                         <Form.Label className="fw-bold">Grooming Done</Form.Label>
//                         <Form.Check
//                           type="checkbox"
//                           name="grooming_done"
//                           checked={!!formData.grooming_done}
//                           onChange={handleChange}
//                           label="Mark as Done"
//                         />
//                       </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                       <Form.Group>
//                         <Form.Label className="fw-bold">KBA Resolution Updated</Form.Label>
//                         <Form.Check
//                           type="checkbox"
//                           name="kba_resolution_updated"
//                           checked={!!formData.kba_resolution_updated}
//                           onChange={handleChange}
//                           label="Yes"
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
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
//     </div>
//   );
// };

// export default PendingQATable;




 
import { Table, Modal, Button, Form, Row, Col, Dropdown, Spinner } from "react-bootstrap";
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
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useAuth();
  const loggedUserSid = user?.user_sid;

  const [qualityPoints, setQualityPoints] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  

  // Fetch users/agents
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await api.get("/users/get/list_users");

        logger.info("Agents API Response:", res.data);
        setUsers(res.data || []);
      } catch (error) {
        logger.error("Error fetching users:", error.response?.data || error.message);
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

        logger.info("Quality Check Points Response:", res.data);

        const points = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.results || [];
        setQualityPoints(points);
      } catch (error) {
        logger.error("Error fetching quality points:", error.response?.data || error.message);
        toast.error("Failed to load quality check points!");
      }
    };
    fetchQualityPoints();
  }, []);

  // Toggle QA comments selection
  // const handleCommentToggle = (comment) => {
  //   setSelectedComments((prev) => {
  //     let updated;
  //     if (prev.find((c) => c.sid === comment.sid)) {
  //       updated = prev.filter((c) => c.sid !== comment.sid);
  //     } else {
  //       updated = [...prev, comment];
  //     }
  //     const scoreSum = updated.reduce((sum, item) => sum + (item.point_value || 0), 0);
  //     setTotalScore(scoreSum);
  //     logger.info("Selected QA Comments:", updated);
  //     return updated;
  //   });
  // };
//   const handleCommentToggle = (parentPoint, subPoint) => {
//   setSelectedComments((prev) => {
//     let updated;
//     // Check if this specific sub-point is already selected
//     if (prev.find((c) => c.sid === subPoint.sid)) {
//       updated = prev.filter((c) => c.sid !== subPoint.sid);
//     } else {
//       // Store the sub-point data
//       updated = [...prev, { 
//         ...subPoint, 
//         parent_name: parentPoint.check_point_name 
//       }];
//     }
    
//     // Calculate score based on sub-point 'max_points'
//     const scoreSum = updated.reduce((sum, item) => sum + (item.max_points || 0), 0);
//     setTotalScore(scoreSum);
//     return updated;
//   });
// };
const handleCommentToggle = (parentPoint, subPoint) => {
  setSelectedComments((prev) => {
    let updated;
    if (prev.find((c) => c.sid === subPoint.sid)) {
      updated = prev.filter((c) => c.sid !== subPoint.sid);
    } else {
      updated = [...prev, { 
        ...subPoint, 
        parent_sid: parentPoint.sid, // Added for the badge count logic
        parent_name: parentPoint.check_point_name 
      }];
    }
    const scoreSum = updated.reduce((sum, item) => sum + (item.max_points || 0), 0);
    setTotalScore(scoreSum);
    return updated;
  });
};

  // Open modal
  const handleOpenModal = (incident) => {
    logger.info("Opening modal for incident:", incident);

    setSelectedIncident(incident);
    setFormData({
      ...incident,
      incident_sid: incident.sid,
      qc_analyst: user?.full_name || "",
      audit_date: incident.audit_date || new Date().toISOString().split("T")[0],
    });

    if (incident.qa_comment) {
      const selectedNames = incident.qa_comment.split(", ").map((name) => name.trim());
      const preSelected = qualityPoints.filter((qp) =>
        selectedNames.includes(qp.check_point_name)
      );
      setSelectedComments(preSelected);
      const scoreSum = preSelected.reduce((sum, item) => sum + (item.point_value || 0), 0);
      setTotalScore(scoreSum);
    } else {
      setSelectedComments([]);
      setTotalScore(0);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    logger.info("Closing modal");
    setShowModal(false);
    setSelectedIncident(null);
    setFormData({});
    setSelectedComments([]);
    setTotalScore(0);
  };

  // Form update
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;
    if (name === "grooming_needed") finalValue = value === "Yes";
    else if (type === "checkbox") finalValue = checked;

    logger.info(`Field changed: ${name} = ${finalValue}`);

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr.split("T")[0];
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return date.toISOString().split("T")[0];
  };

  const handleUpdate = async () => {
    if (!formData?.incident_sid) {
      logger.warn("Incident SID missing in update");
      return toast.warn("Incident SID missing!");
    }

    const payload = [
      {
        incident_sid: formData.incident_sid,
        incident_number: formData.incident_number || selectedIncident.incident_number,
        incident_date: formatDate(formData.incident_date) || selectedIncident.incident_date,
        short_description: formData.short_description ?? selectedIncident.short_description,
        resolution_status: formData.resolution_status ?? selectedIncident.resolution_status,
        resolution_shared: formData.resolution_shared ?? selectedIncident.resolution_shared,
        updates_link: formData.updates_link ?? selectedIncident.updates_link,
        notes: formData.notes ?? selectedIncident.notes,
        escalated_to_team: formData.escalated_to_team ?? selectedIncident.escalated_to_team,
        assigned_analyst: formData.assigned_analyst ?? selectedIncident.assigned_analyst,
        qc_analyst: selectedIncident.qc_analyst,
        is_audited: formData.is_audited ?? selectedIncident.is_audited ?? true,
        audit_status: formData.audit_status ?? selectedIncident.audit_status ?? "done",
        audit_date: new Date().toISOString(),
        qa_status: formData.qa_status ?? selectedIncident.qa_status ?? "",
        rca_done: formData.rca_done ?? selectedIncident.rca_done ?? false,
        grooming_needed: formData.grooming_needed ?? selectedIncident.grooming_needed ?? false,
        grooming_done: formData.grooming_done ?? selectedIncident.grooming_done ?? false,
        kba_resolution_needed:
          formData.kba_resolution_needed ?? selectedIncident.kba_resolution_needed ?? false,
        kba_resolution_updated:
          formData.kba_resolution_updated ?? selectedIncident.kba_resolution_updated ?? false,
        updated_at: new Date().toISOString(),
       // Inside handleUpdate...
scores: selectedComments.reduce((acc, item) => {
  acc[item.sub_check_point_name] = {
    category: item.parent_name,
    description: item.sub_check_point_description,
    point_value: item.max_points,
  };
  return acc;
}, {}),
      },
    ];

    logger.info("Update Incident Payload:", payload);

    try {
      const res = await api.post("/users/update/incident-status", payload);

      logger.info("Update Incident Response:", res.data);

      toast.success(res.data.message || "Incident updated successfully");
      handleCloseModal();

      if (typeof refresh === "function") refresh();
    } catch (error) {
      logger.error("Error updating incident:", error.response?.data || error.message);
      toast.error("Failed to update incident");
    }
  };

  return (
     <div className="bg-white rounded shadow-sm p-3 ">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
      <div className="d-flex justify-content-center align-items-center mb-3">
        <h5 className="fw-bold">Pending QA</h5>
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
                  checked={selectedIncidents.length === incidents.length && incidents.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIncidents(incidents.map((i) => i.sid));
                    else setSelectedIncidents([]);
                  }}
                />
                <span className="ms-1">Select All</span>
              </th>
              <th>Incident No</th>
              <th>Short Description</th>
              <th>Handled By</th>
              <th>Handled On</th>
              <th>QC-Analyst</th>
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
                      onChange={() =>
                        setSelectedIncidents((prev) =>
                          prev.includes(incident.sid)
                            ? prev.filter((id) => id !== incident.sid)
                            : [...prev, incident.sid]
                        )
                      }
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
                  <td className="text-truncate" style={{ maxWidth: "300px" }}>
                    {incident.short_description || "N/A"}
                  </td>
                  <td>
                    {incident.assigned_analyst
                      ? incident.assigned_analyst
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                      : "N/A"}
                  </td>

                  <td>{formatDate(incident.incident_date)}</td>
                  <td>
                    {incident.qc_analyst
                      ? incident.qc_analyst
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(" ")
                      : "NA"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No incidents found.</td>
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
                <Row>
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
                <Row className="mt-3">
                  <Col md={4}>
                    <div className="info-field">
                      <span className="fw-bold me-2 d-block text-nowrap">Handled By:</span>
                      {loadingUsers ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <Form.Select
                          value={formData.assigned_analyst || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, assigned_analyst: e.target.value })
                          }
                          className="custom-dropdown custom-select   fw-semibold"
                        >
                          <option value="">Select Agent</option>
                          {users.map((agent, index) => (
                            <option key={index} value={agent.full_name}>
                              {agent.full_name
                                ? agent.full_name.charAt(0).toUpperCase() +
                                agent.full_name.slice(1).toLowerCase()
                                : "Unknown"}
                            </option>
                          ))}
                        </Form.Select>
                      )}
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

              {/* QA Details */}
              <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                <h6 className="fw-bold mb-3">QA Details</h6>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">QA Status</Form.Label>
                      <Form.Select
                        name="qa_status"
                        value={formData.qa_status || ""}
                        onChange={handleChange}
                        className="custom-dropdown custom-select shadow-sm fw-semibold"
                      >
                        <option value="">-- Select QA Status --</option>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">QA Done On</Form.Label>
                      <Form.Control
                        type="date"
                        name="audit_date"
                        value={formatDate(formData.audit_date)}
                        readOnly
                        className="border border-secondary bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">QA Agent</Form.Label>
                      <Form.Control
                        type="text"
                        name="qc_analyst"
                        value={formData.qc_analyst || user?.full_name || user?.name || ""}
                        readOnly
                        className="border border-secondary bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* QA Comments Dropdown + Total Score */}
                <Row className="align-items-end">
                  <Col md={8}>
 <Form.Group className="mb-3">
  <Form.Label className="fw-bold">QA Checklist</Form.Label>
  <div className="border rounded shadow-sm">
    {qualityPoints.map((category, index) => {
      // Check if any sub-points in this category are selected to show a "count"
      const selectedCount = selectedComments.filter(c => c.parent_sid === category.sid).length;

      return (
        <div key={category.sid} className="border-bottom">
          <div 
            className="d-flex justify-content-between align-items-center p-3 bg-light" 
            style={{ cursor: "pointer" }}
            onClick={() => setDropdownOpen(dropdownOpen === category.sid ? null : category.sid)}
          >
            <div>
              <span className="fw-bold text-dark">{category.check_point_name}</span>
              {selectedCount > 0 && (
                <span className="ms-2 badge rounded-pill bg-primary">{selectedCount} Selected</span>
              )}
            </div>
            <div className="d-flex align-items-center">
              <span className="text-muted small me-3">Max: {category.point_value} pts</span>
              {/* Simple arrow toggle */}
              <span>{dropdownOpen === category.sid ? "▲" : "▼"}</span>
            </div>
          </div>

          {/* Collapsible Content */}
          {dropdownOpen === category.sid && (
            <div className="p-3 bg-white">
              <Row>
                {category.sub_categories?.map((sub) => (
                  <Col md={12} key={sub.sid} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`sub-${sub.sid}`}
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span className="small">
                            <strong>{sub.sub_check_point_name}</strong>
                            <br />
                            <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                              {sub.sub_check_point_description}
                            </span>
                          </span>
                          <span className="badge bg-light text-dark border ms-2" style={{ height: "fit-content" }}>
                            +{sub.max_points}
                          </span>
                        </div>
                      }
                      checked={selectedComments.some((c) => c.sid === sub.sid)}
                      onChange={() => handleCommentToggle(category, sub)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      );
    })}
  </div>
</Form.Group>

 {/* Score Summary Footer */}
<div className="mt-3 p-3 bg-dark text-white rounded d-flex justify-content-between align-items-center">
  <h6 className="mb-0">Current Audit Score:</h6>
  <div className="text-end">
    <span className="h4 mb-0 text-warning">{totalScore}</span>
    <small className="ms-1 text-muted">/ 100</small>
  </div>
</div>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Total Score</Form.Label>
                      <Form.Control
                        type="number"
                        value={totalScore}
                        readOnly
                        className="border border-secondary bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>
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
                        className="custom-select shadow-sm fw-semibold"
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
                  <Row className="mt-3">
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
