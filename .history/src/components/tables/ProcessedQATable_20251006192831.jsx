// //  import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
// // import { useState, useEffect } from "react";
// // import { useAuth } from "../../context/AuthContext";
// // import axios from "axios";

// // const ProcessedQATable = ({ incidents, loading }) => {
// //   const [selectedIncident, setSelectedIncident] = useState(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [formData, setFormData] = useState({});
// //   const [users, setUsers] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [selectedIncidents, setSelectedIncidents] = useState([]);
// //   const { user } = useAuth();
// //   const loggedUserSid = user?.user_sid;

// //   // ✅ Fetch Users
// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:8000/api/users/get/list_users");
// //         setUsers(res.data || []);
// //       } catch (error) {
// //         console.error("❌ Error fetching users:", error);
// //       }
// //     };
// //     fetchUsers();
// //   }, []);

// //   // ✅ Open/Close Modal
// //   const handleOpenModal = (incident) => {
// //     setSelectedIncident(incident);
// //     setFormData(incident);
// //     setShowModal(true);
// //     setIsEditing(false);
// //   };
// //   const handleCloseModal = () => {
// //     setShowModal(false);
// //     setSelectedIncident(null);
// //     setIsEditing(false);
// //   };

// //   // ✅ Handle Form Changes
// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   const handleEdit = () => setIsEditing(true);

// //   const handleUpdate = () => {
// //     console.log("✅ Updated Data:", formData);
// //     // TODO: API update call for processed incidents
// //     setIsEditing(false);
// //     setShowModal(false);
// //   };

// //   // ✅ Assign incidents
// //   const handleAssign = async () => {
// //     if (!selectedUser) {
// //       alert("⚠️ Please select a user first.");
// //       return;
// //     }
// //     if (selectedIncidents.length === 0) {
// //       alert("⚠️ Please select at least one incident.");
// //       return;
// //     }
// //     if (!loggedUserSid) {
// //       alert("⚠️ Unable to find logged-in user SID. Please re-login.");
// //       return;
// //     }

// //     const payload = {
// //       assigned_by_sid: loggedUserSid,
// //       assigned_to_sid: selectedUser,
// //       incident_sid: selectedIncidents,
// //     };

// //     try {
// //       const res = await axios.post(
// //         "http://localhost:8000/api/users/assign/incidents/",
// //         payload
// //       );
// //       console.log("✅ Assign Response:", res.data);
// //       alert("Processed incidents assigned successfully!");
// //       setSelectedIncidents([]);
// //       setSelectedUser(null);
// //     } catch (error) {
// //       console.error("❌ Error assigning processed incidents:", error);
// //       alert("Failed to assign incidents.");
// //     }
// //   };

// //   // ✅ Select incidents
// //   const handleSelectIncident = (incidentSid) => {
// //     setSelectedIncidents((prev) =>
// //       prev.includes(incidentSid)
// //         ? prev.filter((id) => id !== incidentSid)
// //         : [...prev, incidentSid]
// //     );
// //   };
// //   const handleSelectAll = () => {
// //     if (selectedIncidents.length === incidents.length) {
// //       setSelectedIncidents([]);
// //     } else {
// //       setSelectedIncidents(incidents.map((i) => i.sid));
// //     }
// //   };

// //   return (
// //     <div className="bg-white rounded shadow-sm p-3">
// //       <div className="d-flex justify-content-between align-items-center mb-3">
// //         <h5 className="fw-bold">Processed QA</h5>

// //         {/* ✅ User Assignment Controls */}
// //         <div className="d-flex gap-2">
// //           <Form.Select
// //             size="sm"
// //             value={selectedUser || ""}
// //             onChange={(e) => setSelectedUser(e.target.value)}
// //           >
// //             <option value="">-- Select User --</option>
// //             {users.map((user) => (
// //               <option key={user.sid} value={user.sid}>
// //                 {user.full_name}
// //               </option>
// //             ))}
// //           </Form.Select>

// //           <Button
// //             size="sm"
// //             variant="primary"
// //             disabled={selectedIncidents.length === 0 || !selectedUser}
// //             onClick={handleAssign}
// //           >
// //             Assign
// //           </Button>
// //         </div>
// //       </div>

// //       {/* ✅ Table */}
// //       {loading ? (
// //         <div className="text-center py-5">Loading...</div>
// //       ) : (
// //         <Table bordered hover responsive className="align-middle text-center">
// //           <thead className="table-light">
// //             <tr>
// //               <th style={{ width: "65px" }}>
// //                 <Form.Check
// //                   type="checkbox"
// //                    label="Select All"
// //                   checked={
// //                     incidents.length > 0 &&
// //                     selectedIncidents.length === incidents.length
// //                   }
// //                   onChange={handleSelectAll}
// //                 />
// //               </th>
// //               <th>Incident #</th>
// //               <th>Handled By</th>
// //               <th>Handled On</th>
// //               <th>QC-Analyst</th>
// //               <th>Current Status</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {incidents.length > 0 ? (
// //               incidents.map((incident, index) => (
// //                 <tr key={incident.sid || index}>
// //                   <td>
// //                     <Form.Check
// //                       type="checkbox"
// //                       checked={selectedIncidents.includes(incident.sid)}
// //                       onChange={() => handleSelectIncident(incident.sid)}
// //                     />
// //                   </td>
// //                   <td>
// //                     <Button
// //                       variant="link"
// //                       onClick={() => handleOpenModal(incident)}
// //                       style={{ padding: 0 }}
// //                     >
// //                       {incident.incident_number}
// //                     </Button>
// //                   </td>
// //                   <td>{incident.assigned_analyst || "N/A"}</td>
// //                   <td>{incident.incident_date || "N/A"}</td>
// //                   <td>{incident.qc_analyst || "N/A"}</td>
// //                   <td>{incident.resolution_status || "N/A"}</td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="6">No processed QA records found.</td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </Table>
// //       )}

// //       {/* ✅ Modal */}
// //       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
// //         <Modal.Header closeButton>
// //           <Modal.Title><b>Processed Incident Details</b></Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           {formData && (
// //             <Form>
// //               {/* Incident Info */}
// //               <Form.Group className="mb-3">
// //                 <Form.Label><b>Incident #</b></Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   name="incident_number"
// //                   value={formData.incident_number || ""}
// //                   readOnly
// //                 />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label><b>Description</b></Form.Label>
// //                 <Form.Control
// //                   as="textarea"
// //                   rows={2}
// //                   name="short_description"
// //                   value={formData.short_description || ""}
// //                   readOnly={!isEditing}
// //                   onChange={handleChange}
// //                 />
// //               </Form.Group>

// //               {/* Example: QA fields can be same as PendingQATable */}
// //               <Row className="mb-3">
// //                 <Col>
// //                   <Form.Group>
// //                     <Form.Label><b>QA Status</b></Form.Label>
// //                     <Form.Control
// //                       type="text"
// //                       name="qa_status"
// //                       value={formData.qa_status || ""}
// //                       readOnly={!isEditing}
// //                       onChange={handleChange}
// //                     />
// //                   </Form.Group>
// //                 </Col>
// //                 <Col>
// //                   <Form.Group>
// //                     <Form.Label><b>QA Comments</b></Form.Label>
// //                     <Form.Control
// //                       as="textarea"
// //                       rows={2}
// //                       name="qa_comments"
// //                       value={formData.qa_comments || ""}
// //                       readOnly={!isEditing}
// //                       onChange={handleChange}
// //                     />
// //                   </Form.Group>
// //                 </Col>
// //               </Row>
// //             </Form>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           {!isEditing ? (
// //             <Button variant="secondary" onClick={handleEdit}>
// //               Edit
// //             </Button>
// //           ) : (
// //             <Button variant="success" onClick={handleUpdate}>
// //               Save
// //             </Button>
// //           )}
// //           <Button variant="outline-dark" onClick={handleCloseModal}>
// //             Close
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default ProcessedQATable;

import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axois";
import "../PendingQATable.css";

const ProcessedQATable = ({ incidents, loading }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const { user } = useAuth();
  const loggedUserSid = user?.user_sid;
   const [localIncidents, setLocalIncidents] = useState(incidents);

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

  // ✅ Open/Close Modal
    const handleOpenModal = (incident) => {
    setSelectedIncident(incident);

    setFormData({
      ...incident,
      incident_sid: incident.sid, // map sid -> incident_sid
    });

    setShowModal(true);
  };
    const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
    setFormData({});
  };

  // ✅ Handle Form Changes
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
 

  // ✅ Update Processed Incident
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
      alert("Failed to assign incidents.");
    }
  };
 
 const handleSelectAll = () => {
    if (selectedIncidents.length === pendingIncidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(pendingIncidents.map((i) => i.sid));
    }
  };
  
    // 🔑 Filter only non-resolved incidents
  const pendingIncidents = incidents.filter(
    (i) => i.resolution_status?.toLowerCase() !== "resolved"
  );

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Processed QA</h5>

        {/* ✅ User Assignment Controls */}
        <div className="d-flex gap-2">
          <Form.Select
            size="sm"
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Select User --</option>
            {users.map((u) => (
              <option key={u.sid} value={u.sid}>
                {u.full_name}
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

      {/* ✅ Table */}
      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th style={{ width: "65px" }}>
                <Form.Check
                  type="checkbox"
                  label="Select All"
                  
                  checked={
                    incidents.length > 0 &&
                    selectedIncidents.length === incidents.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Incident #</th>
              <th>Handled By</th>
              <th>Handled On</th>
              <th>QC-Analyst</th>
              <th>Current Status</th>
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
                      {incident.incident_number || "N/A"}
                    </Button>
                  </td>
                  <td>{incident.assigned_analyst || "N/A"}</td>
                  <td>{incident.incident_date || "N/A"}</td>
                  <td>{incident.qc_analyst || "N/A"}</td>
                  <td>{incident.resolution_status || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No processed QA records found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* ✅ Modal */}
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

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Incident Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="incident_number"
                    value={formData.incident_number || ""}
                    readOnly
                    className="border border-secondary"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="short_description"
                    value={formData.short_description || ""}
                    onChange={handleChange}
                    className="border border-secondary"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">Handled By</Form.Label>
                      <Form.Control
                        type="text"
                        name="assigned_analyst"
                        value={formData.assigned_analyst || ""}
                        onChange={handleChange}
                        className="border border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">Handled On</Form.Label>
                      <Form.Control
                        type="date"
                        name="incident_date"
                        value={formatDate(formData.incident_date)}
                        onChange={handleChange}
                        className="border border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">Current Status</Form.Label>
                      <Form.Control
                        type="text"
                        name="resolution_status"
                        value={formData.resolution_status || ""}
                        onChange={handleChange}
                        className="border border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* QA Details */}
              <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                <h6 className="fw-bold mb-3">QA Details</h6>

                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">QA Status</Form.Label>
                      <Form.Control
                        type="text"
                        name="qa_status"
                        value={formData.qa_status || ""}
                        onChange={handleChange}
                        className="border border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">QA Done On</Form.Label>
                      <Form.Control
                        type="date"
                        name="audit_date"
                        value={formatDate(formData.audit_date)}
                        onChange={handleChange}
                        className="border border-secondary"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold">QA Agent</Form.Label>
                      <Form.Control
                        type="text"
                        name="qc_analyst"
                        value={formData.qc_analyst || ""}
                        onChange={handleChange}
                        className="border border-secondary"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">QA Comments</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="qa_comments"
                    value={formData.qa_comments || ""}
                    onChange={handleChange}
                    className="border border-secondary"
                  />
                </Form.Group>
              </div>

              {/* Grooming Section */}
              <div className="mb-4 p-3 border rounded shadow-sm bg-light">
                <h6 className="fw-bold mb-3">Grooming Details</h6>

                <Row className="mb-3">
                  <Col>
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
                  <Col>
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

export default ProcessedQATable;


// // src/components/tables/ProcessedQATable.jsx
// import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../api/axois";
// import "../PendingQATable.css"; // ✅ reuse checkbox bold styles

// const ProcessedQATable = ({ incidents, loading, refresh }) => {
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedIncidents, setSelectedIncidents] = useState([]);
//   const { user } = useAuth();
//   const loggedUserSid = user?.user_sid;

//   // keep local copy in sync when parent updates
//   useEffect(() => {
//     setLocalIncidents(incidents);
//   }, [incidents]); 

//   // ✅ Fetch Users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await api.get("/users/get/list_users");
//         setUsers(res.data || []);
//       } catch (error) {
//         console.error("❌ Error fetching users:", error.response?.data || error.message);
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

//   // ✅ Handle Form Changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let finalValue = value;

//     if (name === "grooming_needed") {
//       finalValue = value === "Yes";
//     } else if (type === "checkbox") {
//       finalValue = checked;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: finalValue,
//     }));
//   };

//   // ✅ Format date to YYYY-MM-DD
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     if (dateStr.includes("-")) return dateStr.split("T")[0];
//     const parts = dateStr.split("/");
//     if (parts.length !== 3) return "";
//     const [day, month, year] = parts.map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.toISOString().split("T")[0];
//   };
 
//   // ✅ Update Processed Incident
//   const handleUpdate = async () => {
//     try {
//       if (!formData.incident_sid || !formData.incident_number) {
//         alert("Incident SID or Incident Number is missing!");
//         return;
//       }

//         const payload = [
//       {
//         incident_sid: formData.incident_sid,
//         incident_number: formData.incident_number,
//         incident_date: formatDate(formData.incident_date),
//         short_description: formData.short_description || "",
//         resolution_status: formData.resolution_status || "",
//         resolution_shared: formData.resolution_shared || "",
//         updates_link: formData.updates_link || "",
//         notes: formData.notes || "",
//         assigned_analyst: formData.assigned_analyst || "",
//         qc_analyst: formData.qc_analyst || "",
//         is_audited: formData.is_audited ?? true,
//         audit_status: formData.audit_status || "done",
//         audit_date: formatDate(formData.audit_date),
//         qa_status: formData.qa_status || "done",
//         rca_done: !!formData.rca_done,
//         grooming_needed: !!formData.grooming_needed,
//         grooming_done: !!formData.grooming_done,
//         kba_resolution_needed: !!formData.kba_resolution_needed,
//         kba_resolution_updated: !!formData.kba_resolution_updated,
//         updated_at: new Date().toISOString().split("T")[0],
//       },
//     ];

//       const res = await api.post("/users/update/incident-status", payload);

//       alert(
//         `Message: ${res.data.message}\nIncident IDs: ${res.data.incident_ids?.join(", ")}`
//       );


//        // ✅ Local removal: if resolved, remove from table immediately
//     if (formData.resolution_status?.toLowerCase() === "resolved") {
//       setLocalIncidents((prev) =>
//         prev.filter((i) => i.sid !== formData.incident_sid)
//       );
//     }

//       if (typeof refresh === "function") {
//         await refresh();
//       }

//       setShowModal(false);
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

//   const handleSelectAll = () => {
//     if (selectedIncidents.length === incidents.length) {
//       setSelectedIncidents([]);
//     } else {
//       setSelectedIncidents(incidents.map((i) => i.sid));
//     }
//   };

//   // ✅ Assign incidents
//   const handleAssign = async () => {
//     if (!selectedUser) return alert("⚠️ Please select a user first.");
//     if (selectedIncidents.length === 0) return alert("⚠️ Please select at least one incident.");
//     if (!loggedUserSid) return alert("⚠️ Unable to find logged-in user SID.");

//     const payload = {
//       assigned_by_sid: loggedUserSid,
//       assigned_to_sid: selectedUser,
//       incident_sid: selectedIncidents,
//     };
//   console.log("🚀 Assign payload:", payload);
//     try {
//      const res = await api.post("/users/assign/incidents/", payload); // ✅ with token
//       console.log("✅ Assign response:", res.data);
//       alert("Incidents assigned successfully!");
//       setSelectedIncidents([]);
//       setSelectedUser(null);
//       refresh();
//     } catch (error) {
//       console.error("❌ Error assigning processed incidents:", error.response?.data || error.message);
//       alert("Failed to assign incidents.");
//     }
//   };

//   // // 🔑 Filter out resolved
//   // const processedIncidents = incidents.filter(
//   //   (i) => i.resolution_status?.toLowerCase() !== "resolved"
//   // );

//   return (
//     <div className="bg-white rounded shadow-sm p-3">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h5 className="fw-bold">Processed QA</h5>

//         <div className="d-flex gap-2">
//           <Form.Select
//             size="sm"
//             value={selectedUser || ""}
//             onChange={(e) => setSelectedUser(e.target.value)}
//           >
//             <option value="">-- Select User --</option>
//             {users.map((u) => (
//               <option key={u.sid} value={u.sid}>
//                 {u.full_name}
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
//         </div>
//       </div>

//       {/* ✅ Table */}
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
//                     processedIncidents.length > 0 &&
//                     selectedIncidents.length === processedIncidents.length
//                   }
//                   onChange={handleSelectAll}
//                 />
//                 <span className="ms-1">Select All</span>
//               </th>
//               <th>Incident No</th>
//               <th>Handled By</th>
//               <th>Handled On</th>
//               <th>QC-Analyst</th>
//               <th>Current Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {processedIncidents.length > 0 ? (
//               processedIncidents.map((incident, index) => (
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
//                   <td>{incident.assigned_analyst || "N/A"}</td>
//                   <td>{formatDate(incident.incident_date)}</td>
//                   <td>{incident.qc_analyst || "N/A"}</td>
//                   <td>{incident.resolution_status || "N/A"}</td>
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
//           <Modal.Title className="fw-bold">Processed Incident Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {formData && (
//             <Form>
//               {/* Incident Info */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">Incident Information</h6>

//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">Incident Number</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="incident_number"
//                     value={formData.incident_number || ""}
//                     readOnly
//                     className="border border-secondary"
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">Description</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     name="short_description"
//                     value={formData.short_description || ""}
//                     readOnly={!isEditing}
//                     onChange={handleChange}
//                     className="border border-secondary"
//                   />
//                 </Form.Group>

//                 <Row className="mb-3">
//                   <Col>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">Handled By</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="assigned_analyst"
//                         value={formData.assigned_analyst || ""}
//                         readOnly={!isEditing}
//                         onChange={handleChange}
//                         className="border border-secondary"
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col>
//                     <Form.Group>
//                       <Form.Label className="fw-bold">Handled On</Form.Label>
//                       <Form.Control
//                         type="date"
//                         name="incident_date"
//                         value={formatDate(formData.incident_date)}
//                         readOnly={!isEditing}
//                         onChange={handleChange}
//                         className="border border-secondary"
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </div>

//               {/* QA Details */}
//               <div className="mb-4 p-3 border rounded shadow-sm bg-light">
//                 <h6 className="fw-bold mb-3">QA Details</h6>

//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">QA Status</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="qa_status"
//                     value={formData.qa_status || ""}
//                     readOnly={!isEditing}
//                     onChange={handleChange}
//                     className="border border-secondary"
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-bold">QA Comments</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     name="qa_comments"
//                     value={formData.qa_comments || ""}
//                     readOnly={!isEditing}
//                     onChange={handleChange}
//                     className="border border-secondary"
//                   />
//                 </Form.Group>
//               </div>
//             </Form>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           {!isEditing ? (
//             <Button variant="secondary" onClick={handleEdit}>
//               Edit
//             </Button>
//           ) : (
//             <Button variant="success" onClick={handleUpdate}>
//               Save
//             </Button>
//           )}
//           <Button variant="outline-dark" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ProcessedQATable;
