 

// import { useState, useEffect } from "react";
// import {
//   Table,
//   Modal,
//   Button,
//   Form,
//   Row,
//   Col,
//   Toast,
//   ToastContainer,
// } from "react-bootstrap";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/axois";
// import "../PendingQATable.css";

// const UnassignedTable = ({ incidents = [], loading, refresh }) => {
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [selectedIncidents, setSelectedIncidents] = useState([]);
//   const [localIncidents, setLocalIncidents] = useState(incidents);

//   const [toast, setToast] = useState({ show: false, message: "", variant: "" });
//   const { user } = useAuth();
//   const loggedUserSid = user?.user_sid;

//   // 🔄 Update local incidents when prop changes
//   useEffect(() => {
//     setLocalIncidents(incidents);
//   }, [incidents]);

//   // ✅ Fetch only QA Admins
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await api.get("/users/get/list_users?type=qa_admin"); // <-- filter in API
//         setUsers(res.data || []);
//       } catch (error) {
//         console.error("❌ Error fetching QA Admins:", error);
//       }
//     };
//     fetchUsers();
//   }, []);


//   // Toast helper
//   const showToast = (message, variant = "success") => {
//     setToast({ show: true, message, variant });
//     setTimeout(() => setToast({ show: false, message: "", variant: "" }), 3000);
//   };

//   // 🟩 Open/Close modal
//   const handleOpenModal = (incident) => {
//     setSelectedIncident(incident);
//     setFormData({ ...incident, incident_sid: incident.sid });
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedIncident(null);
//     setFormData({});
//   };

//   // 🟧 Handle Form changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // 🗓️ Date formatter
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     if (dateStr.includes("-")) return dateStr.split("T")[0];
//     const [day, month, year] = dateStr.split("/");
//     return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
//   };

//   // ✅ Update incident details
//   const handleUpdate = async () => {
//     if (!formData.incident_sid) return showToast("Incident SID missing!", "danger");

//     const payload = [
//       {
//         ...formData,
//         incident_date: formatDate(formData.incident_date),
//         audit_date: formatDate(formData.audit_date),
//         updated_at: new Date().toISOString(),
//       },
//     ];

//     try {
//       const res = await api.post("/users/update/incident-status", payload);
//       showToast(`✅ ${res.data.message}`);

//       setLocalIncidents((prev) =>
//         prev.filter((i) => i.sid !== formData.incident_sid)
//       );

//       if (refresh) refresh();
//       handleCloseModal();
//     } catch (error) {
//       console.error("❌ Error updating incident:", error);
//       showToast("Failed to update incident.", "danger");
//     }
//   };

//   // 🟦 Select checkboxes
//   const handleSelectIncident = (incidentSid) => {
//     setSelectedIncidents((prev) =>
//       prev.includes(incidentSid)
//         ? prev.filter((id) => id !== incidentSid)
//         : [...prev, incidentSid]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedIncidents.length === localIncidents.length) {
//       setSelectedIncidents([]);
//     } else {
//       setSelectedIncidents(localIncidents.map((i) => i.sid));
//     }
//   };

//   // 🟩 Assign incidents
//   const handleAssign = async () => {
//     if (!selectedUser) return showToast("Please select a user!", "warning");
//     if (selectedIncidents.length === 0)
//       return showToast("Select at least one incident!", "warning");
//     if (!loggedUserSid) return showToast("User SID missing!", "danger");

//     const payload = {
//       assigned_by_sid: loggedUserSid,
//       assigned_to_sid: selectedUser,
//       incident_sid: selectedIncidents,
//     };

//     try {
//       await api.post("/users/assign/incidents/", payload);
//       showToast("✅ Incidents assigned successfully!", "success");

//       // Remove assigned from table
//       setLocalIncidents((prev) =>
//         prev.filter((i) => !selectedIncidents.includes(i.sid))
//       );

//       // Clear selection
//       setSelectedIncidents([]);
//       setSelectedUser("");

//       if (refresh) refresh();
//     } catch (error) {
//       console.error("❌ Error assigning incidents:", error);
//       showToast("Failed to assign incidents.", "danger");
//     }
//   };

//   return (
//     <div className="bg-white rounded shadow-sm p-3 position-relative">
//       {/* Toast Notifications */}
//       <ToastContainer position="top-end" className="p-3">
//         <Toast
//           show={toast.show}
//           bg={toast.variant}
//           onClose={() => setToast({ ...toast, show: false })}
//         >
//           <Toast.Body className="text-white fw-semibold">{toast.message}</Toast.Body>
//         </Toast>
//       </ToastContainer>

//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div></div>
//         <div className="">
//           <h5 className="fw-bold">Unassigned Incidents</h5>
//         </div>

//         <div className="d-flex gap-2">
//           {/* <Form.Select
//             size="sm"
//             value={selectedUser}
//             onChange={(e) => setSelectedUser(e.target.value)}
//             className="shadow-sm border-primary fw-semibold text-secondary"
//             style={{
//               width: "220px",
//               borderRadius: "10px",
//               cursor: "pointer",
//               transition: "0.3s ease",
//             }}
//           >
//             <option value="">-- Select QA Admin --</option>
//             {users.map((user) => (
//               // <option key={user.sid} value={user.sid}>
//               //   {user.full_name}
//               // </option>
//               <option key={user.sid} value={user.sid}>
//                 {user.full_name
//                   .toLowerCase()
//                   .replace(/\b\w/g, (char) => char.toUpperCase())}
//               </option>

//             ))}
//           </Form.Select> */}

//           <Form.Select
//   size="sm"
//   value={selectedUser}
//   onChange={(e) => setSelectedUser(e.target.value)}
//   className="custom-select shadow-sm fw-semibold"
// >
//   <option value="">-- Select QA Admin --</option>

//   {users.map((user) => (
//     <option key={user.sid} value={user.sid}>
//       {user.full_name
//         .toLowerCase()
//         .replace(/\b\w/g, (char) => char.toUpperCase())}
//     </option>
//   ))}
// </Form.Select>




//           <Button
//             size="sm"
//             variant="primary"
//             disabled={!selectedUser || selectedIncidents.length === 0}
//             onClick={handleAssign}
//           >
//             Assign
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
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
//                   checked={
//                     localIncidents.length > 0 &&
//                     selectedIncidents.length === localIncidents.length
//                   }
//                   onChange={handleSelectAll}
//                 />
//                 <span className="ms-1">Select All</span>
//               </th>
//               <th>Incident No</th>
//               <th>Date</th>
//               <th>Description</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {localIncidents.length > 0 ? (
//               localIncidents.map((incident) => (
//                 <tr key={incident.sid}>
//                   <td>
//                     <Form.Check
//                       type="checkbox"
//                       className="custom-checkbox"
//                       checked={selectedIncidents.includes(incident.sid)}
//                       onChange={() => handleSelectIncident(incident.sid)}
//                     />
//                   </td>
//                   <td>
//                     {/* <Button
//                       variant="link"
//                       onClick={() => handleOpenModal(incident)}
//                       className="p-0"
//                     >
//                       {incident.incident_number}
//                     </Button> */}
//                     {incident.incident_number}
//                   </td>
//                   <td>{incident.incident_date}</td>
//                   <td className="short-desc-cell">
//                     <div className="short-desc-text" title={incident.short_description}>
//                       {incident.short_description || "N/A"}
//                     </div>
//                   </td>
//                   <td>
//                     <span className="badge bg-warning text-dark">
//                       {incident.resolution_status || "Unassigned"}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5">No unassigned incidents found.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
//         <Modal.Header closeButton className="bg-primary text-white">
//           <Modal.Title>Incident Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Incident Number</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="incident_number"
//                 value={formData.incident_number || ""}
//                 readOnly
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 name="short_description"
//                 value={formData.short_description || ""}
//                 onChange={handleChange}
//               />
//             </Form.Group>

//             <Row>
//               <Col>
//                 <Form.Group>
//                   <Form.Label>Handled By</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="assigned_analyst"
//                     value={formData.assigned_analyst || ""}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col>
//                 <Form.Group>
//                   <Form.Label>Status</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="resolution_status"
//                     value={formData.resolution_status || ""}
//                     onChange={handleChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>
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

// export default UnassignedTable;



 import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axois";
import logger from "../../utils/logger";   // ✅ Added logger
import "../PendingQATable.css";

const UnassignedTable = ({ incidents = [], loading, refresh }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [localIncidents, setLocalIncidents] = useState(incidents);

  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const { user } = useAuth();
  const loggedUserSid = user?.user_sid;

  // 🔄 Update local incidents when prop changes
  useEffect(() => {
    setLocalIncidents(incidents);
  }, [incidents]);

  // ✅ Fetch only QA Admins
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/get/list_users?type=qa_admin");
        logger.info("Fetched QA admins:", res.data);  // ✅ Logger
        setUsers(res.data || []);
      } catch (error) {
        logger.error("❌ Error fetching QA Admins:", error);  // ✅ Logger
      }
    };
    fetchUsers();
  }, []);

  // Toast helper
  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "" }), 3000);
  };

  // 🟩 Open/Close modal
  const handleOpenModal = (incident) => {
    logger.info("Opening modal for incident:", incident);  // ✅ Logger
    setSelectedIncident(incident);
    setFormData({ ...incident, incident_sid: incident.sid });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    logger.info("Closing modal");  // ✅ Logger
    setShowModal(false);
    setSelectedIncident(null);
    setFormData({});
  };

  // 🟧 Handle Form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    logger.info(`Form changed: ${name} = ${value}`);  // ✅ Logger
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🗓️ Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr.split("T")[0];

    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // ✅ Update incident details
  const handleUpdate = async () => {
    if (!formData.incident_sid) {
      logger.warn("Incident SID missing");  // ✅ Logger
      return showToast("Incident SID missing!", "danger");
    }

    const payload = [
      {
        ...formData,
        incident_date: formatDate(formData.incident_date),
        audit_date: formatDate(formData.audit_date),
        updated_at: new Date().toISOString(),
      },
    ];

    logger.info("Update payload:", payload);  // ✅ Logger

    try {
      const res = await api.post("/users/update/incident-status", payload);
      logger.info("Update success:", res.data);  // ✅ Logger
      showToast(`✅ ${res.data.message}`);

      setLocalIncidents((prev) =>
        prev.filter((i) => i.sid !== formData.incident_sid)
      );

      if (refresh) refresh();
      handleCloseModal();
    } catch (error) {
      logger.error("❌ Error updating incident:", error);  // ✅ Logger
      showToast("Failed to update incident.", "danger");
    }
  };

  // 🟦 Select checkboxes
  const handleSelectIncident = (incidentSid) => {
    logger.info("Selecting incident:", incidentSid);  // ✅ Logger

    setSelectedIncidents((prev) =>
      prev.includes(incidentSid)
        ? prev.filter((id) => id !== incidentSid)
        : [...prev, incidentSid]
    );
  };

  const handleSelectAll = () => {
    logger.info("Toggle select all");  // ✅ Logger

    if (selectedIncidents.length === localIncidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(localIncidents.map((i) => i.sid));
    }
  };

  // 🟩 Assign incidents
  const handleAssign = async () => {
    if (!selectedUser) {
      logger.warn("User not selected");  // ✅ Logger
      return showToast("Please select a user!", "warning");
    }

    if (selectedIncidents.length === 0) {
      logger.warn("No incidents selected");  // ✅ Logger
      return showToast("Select at least one incident!", "warning");
    }

    if (!loggedUserSid) {
      logger.error("Logged user SID missing");  // ✅ Logger
      return showToast("User SID missing!", "danger");
    }

    const payload = {
      assigned_by_sid: loggedUserSid,
      assigned_to_sid: selectedUser,
      incident_sid: selectedIncidents,
    };

    logger.info("Assign payload:", payload);  // ✅ Logger

    try {
      await api.post("/users/assign/incidents/", payload);

      logger.info("Assigned incidents:", selectedIncidents);  // ✅ Logger
      showToast("✅ Incidents assigned successfully!", "success");

      setLocalIncidents((prev) =>
        prev.filter((i) => !selectedIncidents.includes(i.sid))
      );

      setSelectedIncidents([]);
      setSelectedUser("");

      if (refresh) refresh();
    } catch (error) {
      logger.error("❌ Error assigning incidents:", error);  // ✅ Logger
      showToast("Failed to assign incidents.", "danger");
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-3 position-relative">
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          bg={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
        >
          <Toast.Body className="text-white fw-semibold">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div></div>
        <div className="">
          <h5 className="fw-bold">Unassigned Incidents</h5>
        </div>

        <div className="d-flex gap-2">
          <Form.Select
            size="sm"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="custom-select shadow-sm fw-semibold"
          >
            <option value="">-- Select QA Admin --</option>

            {users.map((user) => (
              <option key={user.sid} value={user.sid}>
                {user.full_name
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </option>
            ))}
          </Form.Select>

          <Button
            size="sm"
            variant="primary"
            disabled={!selectedUser || selectedIncidents.length === 0}
            onClick={handleAssign}
          >
            Assign
          </Button>
        </div>
      </div>

      {/* Table */}
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
                    localIncidents.length > 0 &&
                    selectedIncidents.length === localIncidents.length
                  }
                  onChange={handleSelectAll}
                />
                <span className="ms-1">Select All</span>
              </th>
              <th>Incident No</th>
               <th>Description</th>
              <th>Handled On</th>
              <th>Handled By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {localIncidents.length > 0 ? (
              localIncidents.map((incident) => (
                <tr key={incident.sid}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      className="custom-checkbox"
                      checked={selectedIncidents.includes(incident.sid)}
                      onChange={() => handleSelectIncident(incident.sid)}
                    />
                  </td>
                  <td>{incident.incident_number}</td>
                  <td className="short-desc-cell">
                    <div
                      className="short-desc-text"
                      title={incident.short_description}
                    >
                      {incident.short_description || "N/A"}
                    </div>
                  </td>
                  <td>{incident.incident_date}</td>
                   <td>
                    {incident.assigned_analyst
                      ? incident.assigned_analyst
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                      : "N/A"}
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Incident Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Incident Number</Form.Label>
              <Form.Control
                type="text"
                name="incident_number"
                value={formData.incident_number || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="short_description"
                value={formData.short_description || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Handled By</Form.Label>
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
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    type="text"
                    name="resolution_status"
                    value={formData.resolution_status || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
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

export default UnassignedTable;
