// import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/axois";
// import logger from "../../utils/logger";
// import "../PendingQATable.css";

// const ProcessedQATable = ({ incidents, loading, refresh }) => {
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedIncidents, setSelectedIncidents] = useState([]);
//   const [localIncidents, setLocalIncidents] = useState(incidents || []);
//   const { user } = useAuth();
//   const loggedUserSid = user?.user_sid;

//   // ✅ Fetch Users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await api.get("/users/get/list_users");
//         logger.info("Users API:", res.data);
//         // console.log("Users API:", res.data);
//         setUsers(res.data || []);
//       } catch (error) {
//         console.error("❌ Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ✅ Open/Close Modal
//   const handleOpenModal = (incident) => {
//     setSelectedIncident(incident);
//     setFormData({
//       ...incident,
//       incident_sid: incident.sid,
//     });
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedIncident(null);
//     setFormData({});
//   };

//   // ✅ Handle form changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let finalValue = value;
//     if (name === "grooming_needed") finalValue = value === "Yes";
//     else if (type === "checkbox") finalValue = checked;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: finalValue,
//     }));
//   };

//   // ✅ Format date to YYYY-MM-DD
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     if (dateStr.includes("-")) return dateStr.split("T")[0];
//     const parts = dateStr.split("/"); // DD/MM/YYYY
//     if (parts.length !== 3) return "";
//     const [day, month, year] = parts.map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.toISOString().split("T")[0];
//   };

//   // ✅ Update processed incident
//   const handleUpdate = async () => {
//     try {
//       if (!formData.incident_sid || !formData.incident_number) {
//         alert("Incident SID or Incident Number is missing!");
//         return;
//       }

//       const payload = [
//         {
//           incident_sid: formData.incident_sid,
//           incident_number: formData.incident_number,
//           incident_date: formatDate(formData.incident_date),
//           short_description: formData.short_description || "",
//           resolution_status: formData.resolution_status || "",
//           resolution_shared: formData.resolution_shared || "",
//           updates_link: formData.updates_link || "",
//           notes: formData.notes || "",
//           assigned_analyst: formData.assigned_analyst || "",
//           qc_analyst: formData.qc_analyst || "",
//           is_audited: formData.is_audited ?? true,
//           audit_status: formData.audit_status || "done",
//           audit_date: formatDate(formData.audit_date),
//           qa_status: formData.qa_status || "done",
//           rca_done: !!formData.rca_done,
//           grooming_needed: !!formData.grooming_needed,
//           grooming_done: !!formData.grooming_done,
//           kba_resolution_needed: !!formData.kba_resolution_needed,
//           kba_resolution_updated: !!formData.kba_resolution_updated,
//           updated_at: new Date().toISOString().split("T")[0],
//         },
//       ];

//       const res = await api.post("/users/update/incident-status", payload);
//       console.log("Update Response:", res.data);

//       alert(
//         `Message: ${res.data.message}\nIncident IDs: ${res.data.incident_ids?.join(", ")}`
//       );

//       // ✅ Remove resolved incidents locally
//       if (formData.resolution_status?.toLowerCase() === "resolved") {
//         setLocalIncidents((prev) =>
//           prev.filter((i) => i.sid !== formData.incident_sid)
//         );
//       }

//       if (typeof refresh === "function") await refresh();

//       handleCloseModal();
//     } catch (error) {
//       console.error("❌ Error updating incident:", error.response?.data || error.message);
//       alert(
//         `Failed to update incident.\n\n${
//           error.response?.data
//             ? JSON.stringify(error.response.data, null, 2)
//             : error.message
//         }`
//       );
//     }
//   };

//   // ✅ Select incidents
//   const handleSelectIncident = (incidentSid) => {
//     setSelectedIncidents((prev) =>
//       prev.includes(incidentSid)
//         ? prev.filter((id) => id !== incidentSid)
//         : [...prev, incidentSid]
//     );
//   };

//   // ✅ Assign incidents
//   const handleAssign = async () => {
//     if (!selectedUser) return alert("Please select a user first.");
//     if (selectedIncidents.length === 0) return alert("Please select at least one incident.");
//     if (!loggedUserSid) return alert("Unable to find logged-in user SID.");

//     const payload = {
//       assigned_by_sid: loggedUserSid,
//       assigned_to_sid: selectedUser,
//       incident_sid: selectedIncidents,
//     };

//     console.log("Assign payload:", payload);

//     try {
//       const res = await api.post("/users/assign/incidents/", payload);
//       console.log("Assign Response:", res.data);
//       alert("Incidents assigned successfully!");
//       setSelectedIncidents([]);
//       setSelectedUser(null);
//       if (typeof refresh === "function") refresh();
//     } catch (error) {
//       console.error("❌ Error assigning incidents:", error.response?.data || error);
//       alert("Failed to assign incidents.");
//     }
//   };

//   // 🔑 Only non-resolved incidents
//   const pendingIncidents = incidents.filter(
//     (i) => i.resolution_status?.toLowerCase() !== "resolved"
//   );

//   return (
//     <div className="bg-white rounded shadow-sm p-3">
//       <div className="d-flex justify-content-center align-items-center mb-3">
//         <h5 className="fw-bold">Processed QA</h5>
//       </div>

//       {/* ✅ Table */}
//       {loading ? (
//         <div className="text-center py-5">Loading...</div>
//       ) : (
//         <Table bordered hover responsive className="align-middle text-center">
//           <thead className="table-light">
//             <tr>
//               <th>Incident No</th>
//               <th>Short Description</th>
//               <th>Handled By</th>
//               <th>Handled On</th>
//               <th>QC-Analyst</th>
//               <th>QA-Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {incidents.length > 0 ? (
//               incidents.map((incident, index) => (
//                 <tr key={incident.sid || index}>
//                   <td>{incident.incident_number || "N/A"}</td>
//                   <td className="short-desc-cell" title={incident.short_description}>
//                     {incident.short_description || "N/A"}
//                   </td>
//                   <td>
//                     {incident.assigned_analyst
//                       ? incident.assigned_analyst
//                           .split(" ")
//                           .map(
//                             (word) =>
//                               word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//                           )
//                           .join(" ")
//                       : "N/A"}
//                   </td>
//                   <td>{incident.incident_date || "N/A"}</td>
//                   <td>
//                     {incident.qc_analyst
//                       ? incident.qc_analyst.charAt(0).toUpperCase() +
//                         incident.qc_analyst.slice(1).toLowerCase()
//                       : "NA"}
//                   </td>
//                   <td>
//                     {incident.qa_status ? (
//                       <span
//                         className={`badge rounded-pill ${
//                           incident.qa_status.toLowerCase() === "pass"
//                             ? "bg-success"
//                             : incident.qa_status.toLowerCase() === "fail"
//                             ? "bg-danger"
//                             : "bg-secondary"
//                         }`}
//                       >
//                         {incident.qa_status.charAt(0).toUpperCase() +
//                           incident.qa_status.slice(1).toLowerCase()}
//                       </span>
//                     ) : (
//                       <span className="badge rounded-pill bg-secondary">N/A</span>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6">No processed QA records found.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* ✅ Modal */}
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
//                 <Row className="mb-3">
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">Incident Number:</span>
//                       <span>{formData.incident_number || "N/A"}</span>
//                     </div>
//                   </Col>
//                   <Col md={8}>
//                     <div className="info-field description-field">
//                       <span className="fw-bold me-2">Description:</span>
//                       <span>{formData.short_description || "N/A"}</span>
//                     </div>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col md={4}>
//                     <div className="info-field">
//                       <span className="fw-bold me-2">Handled By:</span>
//                       <span>{formData.assigned_analyst || "N/A"}</span>
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
//                   <Col>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">QA Status</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="qa_status"
//                         value={formData.qa_status || ""}
//                         onChange={handleChange}
//                         className="border border-secondary"
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">QA Done On</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="audit_date"
//                         value={formatDate(formData.audit_date)}
//                         onChange={handleChange}
//                         className="border border-secondary"
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">QA Agent</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="qc_analyst"
//                         value={formData.qc_analyst || ""}
//                         onChange={handleChange}
//                         className="border border-secondary"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">QA Comments</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     name="qa_comments"
//                     value={formData.qa_comments || ""}
//                     onChange={handleChange}
//                     className="border border-secondary"
//                   />
//                 </Form.Group>
//               </div>

//               {/* Grooming Section */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">Grooming Details</h6>
//                 <Row className="mb-3">
//                   <Col>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">Grooming Needed</Form.Label>
//                       <Form.Select
//                         name="grooming_needed"
//                         value={formData.grooming_needed ? "Yes" : "No"}
//                         onChange={handleChange}
//                         className="border border-secondary"
//                       >
//                         <option value="No">No</option>
//                         <option value="Yes">Yes</option>
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                   <Col>
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

// export default ProcessedQATable;






import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axois";
import logger from "../../utils/logger";   // <-- Already imported
import "../PendingQATable.css";

const ProcessedQATable = ({ incidents, loading, refresh }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [localIncidents, setLocalIncidents] = useState(incidents || []);
  const { user } = useAuth();
  const loggedUserSid = user?.user_sid;

  // ✅ Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        logger.info("Fetching user list...");
        const res = await api.get("/users/get/list_users");
        logger.info("Users API Response:", res.data);
        setUsers(res.data || []);
      } catch (error) {
        logger.error("❌ Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Open/Close Modal
  const handleOpenModal = (incident) => {
    logger.info("Opening modal for incident:", incident);
    setSelectedIncident(incident);
    setFormData({
      ...incident,
      incident_sid: incident.sid,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    logger.info("Closing modal...");
    setShowModal(false);
    setSelectedIncident(null);
    setFormData({});
  };

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;

    if (name === "grooming_needed") finalValue = value === "Yes";
    else if (type === "checkbox") finalValue = checked;

    logger.info(`Form Change → ${name}:`, finalValue);

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  // ✅ Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr.split("T")[0];
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return date.toISOString().split("T")[0];
  };

  // ✅ Update processed incident
  const handleUpdate = async () => {
    try {
      logger.info("Preparing payload for update:", formData);

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
        },
      ];

      logger.info("Update Payload:", payload);

      const res = await api.post("/users/update/incident-status", payload);
      logger.info("Update API Response:", res.data);

      alert(
        `Message: ${res.data.message}\nIncident IDs: ${res.data.incident_ids?.join(", ")}`
      );

      if (formData.resolution_status?.toLowerCase() === "resolved") {
        logger.info("Removing resolved incident locally:", formData.incident_sid);
        setLocalIncidents((prev) =>
          prev.filter((i) => i.sid !== formData.incident_sid)
        );
      }

      if (typeof refresh === "function") await refresh();

      handleCloseModal();
    } catch (error) {
      logger.error("❌ Error updating incident:", error);
      alert(
        `Failed to update incident.\n\n${
          error.response?.data
            ? JSON.stringify(error.response.data, null, 2)
            : error.message
        }`
      );
    }
  };

  // ✅ Select incidents
  const handleSelectIncident = (incidentSid) => {
    logger.info("Selecting incident:", incidentSid);

    setSelectedIncidents((prev) =>
      prev.includes(incidentSid)
        ? prev.filter((id) => id !== incidentSid)
        : [...prev, incidentSid]
    );
  };

  // ✅ Assign incidents
  const handleAssign = async () => {
    if (!selectedUser) return alert("Please select a user first.");
    if (selectedIncidents.length === 0) return alert("Please select at least one incident.");
    if (!loggedUserSid) return alert("Unable to find logged-in user SID.");

    const payload = {
      assigned_by_sid: loggedUserSid,
      assigned_to_sid: selectedUser,
      incident_sid: selectedIncidents,
    };

    logger.info("Assign Payload:", payload);

    try {
      const res = await api.post("/users/assign/incidents/", payload);
      logger.info("Assign Response:", res.data);
      alert("Incidents assigned successfully!");

      setSelectedIncidents([]);
      setSelectedUser(null);
      if (typeof refresh === "function") refresh();
    } catch (error) {
      logger.error("❌ Error assigning incidents:", error);
      alert("Failed to assign incidents.");
    }
  };

  // 🔑 Only non-resolved incidents
  const pendingIncidents = incidents.filter(
    (i) => i.resolution_status?.toLowerCase() !== "resolved"
  );

  return (
    // <div className="bg-white rounded shadow-sm p-3">
    //   <div className="d-flex justify-content-center align-items-center mb-3">
    //     <h5 className="fw-bold">Processed QA</h5>
    //   </div>

    //   {/* Table */}
    //   {loading ? (
    //     <div className="text-center py-5">Loading...</div>
    //   ) : (
    //     <Table bordered hover responsive className="align-middle text-center">
    //       <thead className="table-light">
    //         <tr>
    //           <th>Incident No</th>
    //           <th>Short Description</th>
    //           <th>Handled On</th>
    //           <th>Handled By</th>
    //           <th>QC Date</th>
    //           <th>QC-Analyst</th>
    //           <th>QA-Status</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {incidents.length > 0 ? (
    //           incidents.map((incident, index) => (
    //             <tr key={incident.sid || index}>
    //               <td>{incident.incident_number || "N/A"}</td>
    //               <td
    //                 className="short-desc-cell"
    //                 title={incident.short_description}
    //               >
    //                 {incident.short_description || "N/A"}
    //               </td>
    //                <td>{incident.incident_date || "N/A"}</td>
    //               <td>
    //                 {incident.assigned_analyst
    //                   ? incident.assigned_analyst
    //                       .split(" ")
    //                       .map(
    //                         (word) =>
    //                           word.charAt(0).toUpperCase() +
    //                           word.slice(1).toLowerCase()
    //                       )
    //                       .join(" ")
    //                   : "N/A"}
    //               </td>
    //               <td>{formatDate(incident.updated_at) || "N/A"}</td>
    //               <td>
    //                 {incident.qc_analyst
    //                   ? incident.qc_analyst.charAt(0).toUpperCase() +
    //                     incident.qc_analyst.slice(1).toLowerCase()
    //                   : "NA"}
    //               </td>
    //               <td>
    //                 {incident.qa_status ? (
    //                   <span
    //                     className={`badge rounded-pill ${
    //                       incident.qa_status.toLowerCase() === "pass"
    //                         ? "bg-success"
    //                         : incident.qa_status.toLowerCase() === "fail"
    //                         ? "bg-danger"
    //                         : "bg-secondary"
    //                     }`}
    //                   >
    //                     {incident.qa_status.charAt(0).toUpperCase() +
    //                       incident.qa_status.slice(1).toLowerCase()}
    //                   </span>
    //                 ) : (
    //                   <span className="badge rounded-pill bg-secondary">N/A</span>
    //                 )}
    //               </td>
    //             </tr>
    //           ))
    //         ) : (
    //           <tr>
    //             <td colSpan="6">No processed QA records found.</td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </Table>
    //   )}

    //   {/* Modal */}
    //   <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
    //     <Modal.Header closeButton className="bg-primary text-white">
    //       <Modal.Title className="fw-bold">Incident Details</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       {formData && (
    //         <Form>
    //           {/* Incident Info */}
    //           <div className="mb-4 p-3 border rounded shadow-sm bg-light">
    //             <h6 className="fw-bold mb-3">Incident Information</h6>
    //             <Row className="mb-3">
    //               <Col md={4}>
    //                 <div className="info-field">
    //                   <span className="fw-bold me-2">Incident Number:</span>
    //                   <span>{formData.incident_number || "N/A"}</span>
    //                 </div>
    //               </Col>
    //               <Col md={8}>
    //                 <div className="info-field description-field">
    //                   <span className="fw-bold me-2">Description:</span>
    //                   <span>{formData.short_description || "N/A"}</span>
    //                 </div>
    //               </Col>
    //             </Row>
    //             <Row>
    //               <Col md={4}>
    //                 <div className="info-field">
    //                   <span className="fw-bold me-2">Handled By:</span>
    //                   <span>{formData.assigned_analyst || "N/A"}</span>
    //                 </div>
    //               </Col>
    //               <Col md={4}>
    //                 <div className="info-field">
    //                   <span className="fw-bold me-2">Handled On:</span>
    //                   <span>{formatDate(formData.incident_date) || "N/A"}</span>
    //                 </div>
    //               </Col>
    //               <Col md={4}>
    //                 <div className="info-field">
    //                   <span className="fw-bold me-2">Current Status:</span>
    //                   <span>{formData.resolution_status || "N/A"}</span>
    //                 </div>
    //               </Col>
    //             </Row>
    //           </div>

    //           {/* QA Details */}
    //           <div className="mb-4 p-3 border rounded shadow-sm bg-light">
    //             <h6 className="fw-bold mb-3">QA Details</h6>
    //             <Row className="mb-3">
    //               <Col>
    //                 <Form.Group>
    //                   <Form.Label className="fw-bold">QA Status</Form.Label>
    //                   <Form.Control
    //                     type="text"
    //                     name="qa_status"
    //                     value={formData.qa_status || ""}
    //                     onChange={handleChange}
    //                     className="border border-secondary"
    //                   />
    //                 </Form.Group>
    //               </Col>
    //               <Col>
    //                 <Form.Group>
    //                   <Form.Label className="fw-bold">QA Done On</Form.Label>
    //                   <Form.Control
    //                     type="date"
    //                     name="audit_date"
    //                     value={formatDate(formData.audit_date)}
    //                     onChange={handleChange}
    //                     className="border border-secondary"
    //                   />
    //                 </Form.Group>
    //               </Col>
    //               <Col>
    //                 <Form.Group>
    //                   <Form.Label className="fw-bold">QA Agent</Form.Label>
    //                   <Form.Control
    //                     type="text"
    //                     name="qc_analyst"
    //                     value={formData.qc_analyst || ""}
    //                     onChange={handleChange}
    //                     className="border border-secondary"
    //                   />
    //                 </Form.Group>
    //               </Col>
    //             </Row>
    //             <Form.Group className="mb-3">
    //               <Form.Label className="fw-bold">QA Comments</Form.Label>
    //               <Form.Control
    //                 as="textarea"
    //                 rows={2}
    //                 name="qa_comments"
    //                 value={formData.qa_comments || ""}
    //                 onChange={handleChange}
    //                 className="border border-secondary"
    //               />
    //             </Form.Group>
    //           </div>

    //           {/* Grooming Section */}
    //           <div className="mb-4 p-3 border rounded shadow-sm bg-light">
    //             <h6 className="fw-bold mb-3">Grooming Details</h6>
    //             <Row className="mb-3">
    //               <Col>
    //                 <Form.Group>
    //                   <Form.Label className="fw-bold">Grooming Needed</Form.Label>
    //                   <Form.Select
    //                     name="grooming_needed"
    //                     value={formData.grooming_needed ? "Yes" : "No"}
    //                     onChange={handleChange}
    //                     className="border border-secondary"
    //                   >
    //                     <option value="No">No</option>
    //                     <option value="Yes">Yes</option>
    //                   </Form.Select>
    //                 </Form.Group>
    //               </Col>
    //               <Col>
    //                 <Form.Group>
    //                   <Form.Label className="fw-bold">
    //                     Grooming Instructions
    //                   </Form.Label>
    //                   <Form.Control
    //                     type="text"
    //                     name="grooming_instructions"
    //                     value={formData.grooming_instructions || ""}
    //                     onChange={handleChange}
    //                     className="border border-secondary"
    //                   />
    //                 </Form.Group>
    //               </Col>
    //             </Row>
    //           </div>
    //         </Form>
    //       )}
    //     </Modal.Body>

    //     <Modal.Footer>
    //       <Button variant="success" onClick={handleUpdate}>
    //         Save
    //       </Button>
    //       <Button variant="outline-dark" onClick={handleCloseModal}>
    //         Close
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    // </div>

    <div className="bg-white rounded-4 shadow-sm border overflow-hidden position-relative">
  
  {/* ✅ Premium Lite Banner for Processed QA */}
  <div className="premium-lite-banner d-flex justify-content-between align-items-center px-4 py-2 border-bottom" 
       style={{ background: 'linear-gradient(to right, #fdfbfb 0%, #ebedee 100%)' }}>
    <div className="d-flex align-items-center">
      <div className="header-accent-pill me-3" style={{ height: '24px', backgroundColor: '#198754' }}></div>
      <div>
        <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.1rem' }}>Processed QA Records</h5>
        <small className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>Historical Audit Data</small>
      </div>
    </div>

    <div className="modern-count-badge py-1 border-success-subtle">
      <span className="badge-text" style={{ fontSize: '0.6rem' }}>COMPLETED</span>
      <span className="badge-number bg-success text-white" style={{ width: '22px', height: '22px', fontSize: '0.7rem' }}>
        {incidents.length}
      </span>
    </div>
  </div>

  {/* ✅ High-Density Table */}
  {loading ? (
    <div className="text-center py-5">
      <Spinner animation="border" size="sm" variant="success" />
      <p className="text-muted mt-2 small">Loading historical data...</p>
    </div>
  ) : (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0 refined-table compact-view">
        <thead>
          <tr className="bg-light">
            <th className="ps-4 small-header">INCIDENT NO</th>
            <th className="small-header">SHORT DESCRIPTION</th>
            <th className="small-header">HANDLED ON</th>
            <th className="small-header">QC DATE</th>
            <th className="small-header">QC ANALYST</th>
            <th className="small-header text-center">QA STATUS</th>
          </tr>
        </thead>
        <tbody>
          {incidents.length > 0 ? (
            incidents.slice(0, 10).map((incident, index) => (
              <tr key={incident.sid || index} className="cursor-pointer">
                <td className="ps-4">
                  <span className="incident-link fw-bold text-primary" onClick={() => handleRowClick(incident)}>
                    {incident.incident_number || "N/A"}
                  </span>
                </td>
                <td>
                  <div className="description-text text-secondary" title={incident.short_description}>
                    {incident.short_description || "N/A"}
                  </div>
                </td>
                <td className="date-text">{incident.incident_date || "N/A"}</td>
                <td className="date-text fw-medium">{formatDate(incident.updated_at) || "N/A"}</td>
                <td>
                  <div className="analyst-name">
                    <i className="bi bi-person-check me-1"></i>
                    {incident.qc_analyst || "N/A"}
                  </div>
                </td>
                <td className="text-center">
                  <span className={`badge rounded-pill px-3 py-1 shadow-sm border ${
                    incident.qa_status?.toLowerCase() === "pass" 
                    ? "bg-success-subtle text-success border-success-subtle" 
                    : "bg-danger-subtle text-danger border-danger-subtle"
                  }`} style={{ fontSize: '0.7rem', letterSpacing: '0.3px' }}>
                    {incident.qa_status?.toUpperCase() || "N/A"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted small">No processed records found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )}
</div>
  );
};

export default ProcessedQATable;
