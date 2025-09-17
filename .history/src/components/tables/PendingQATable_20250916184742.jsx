//  import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { useState } from "react";
// import "./PendingQATable.jsx"

// const PendingQATable = ({ incidents, loading }) => {
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});

//   const handleOpenModal = (incident) => {
//     setSelectedIncident(incident);
//     setFormData(incident); // pre-fill form
//     setShowModal(true);
//     setIsEditing(false);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedIncident(null);
//     setIsEditing(false);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleEdit = () => setIsEditing(true);

//   const handleUpdate = () => {
//     console.log("✅ Updated Data:", formData);
//     // TODO: API call to update backend
//     setIsEditing(false);
//     setShowModal(false);
//   };

//   return (
//     <div className="bg-white rounded shadow-sm p-3">
//       <h5 className="fw-bold mb-3">Pending QA</h5>
//       {loading ? (
//         <div className="text-center py-5">Loading...</div>
//       ) : (
//         <Table bordered hover responsive className="align-middle text-center">
//           <thead className="table-light">
//             <tr>
//               <th>Incident No</th>
//               <th>Handled By</th>
//               <th>Handled On</th>
//               <th>QC-Analyst</th>
//               <th>Current Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {incidents.length > 0 ? (
//               incidents.map((incident, index) => (
//                 <tr key={incident.sid || index}>
//                   <td>
//                     <Button
//                       variant="link"
//                       onClick={() => handleOpenModal(incident)}
//                       style={{ padding: 0 }}
//                     >
//                       {incident.incident_number}
//                     </Button>
//                   </td>
//                   <td>{incident.assigned_analyst}</td>
//                   <td>{incident.incident_date}</td>
//                   <td>{incident.qc_analyst}</td>
//                   <td>{incident.resolution_status}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5">No processed QA records found.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       {/* ✅ Full Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
//          <Modal.Header closeButton className="bg-primary text-white">
//     <Modal.Title>Pending QA</Modal.Title>
//   </Modal.Header>
//         <Modal.Body className="p-4">
//           {formData && (
//             <Form>
//               {/* Incident & Description */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Incident #</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="incident_number"
//                   value={formData.incident_number || ""}
//                   readOnly
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   name="short_description"
//                   value={formData.short_description || ""}
//                   readOnly={!isEditing}
//                   onChange={handleChange}
//                 />
//               </Form.Group>

//               <Row className="mb-3">
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>Handled By</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="assigned_analyst"
//                       value={formData.assigned_analyst || ""}
//                       readOnly
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>Handled On</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="incident_date"
//                       value={formData.incident_date || ""}
//                       readOnly
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>Current Status</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="resolution_status"
//                       value={formData.resolution_status || ""}
//                       readOnly={!isEditing}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {/* QA Section */}
//               <Row className="mb-3">
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>QA Status</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="qa_status"
//                       value={formData.qa_status || ""}
//                       readOnly={!isEditing}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>QA Done On</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="audit_date"
//                       value={formData.audit_date || ""}
//                       readOnly
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>QA Agent</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="qc_analyst"
//                       value={formData.qc_analyst || ""}
//                       readOnly
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Form.Group className="mb-3">
//                 <Form.Label>QA Comments</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   name="qa_comments"
//                   value={formData.qa_comments || ""}
//                   readOnly={!isEditing}
//                   onChange={handleChange}
//                 />
//               </Form.Group>

//               {/* Checkboxes */}
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Check
//                     type="checkbox"
//                     label="Correct Pruning"
//                     name="correct_pruning"
//                     checked={formData.correct_pruning || false}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                   />
//                   <Form.Check
//                     type="checkbox"
//                     label="Work Notes Added"
//                     name="work_notes_added"
//                     checked={formData.work_notes_added || false}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                   />
//                   <Form.Check
//                     type="checkbox"
//                     label="Resolution Quality"
//                     name="resolution_quality"
//                     checked={formData.resolution_quality || false}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                   />
//                 </Col>
//                 <Col md={6}>
//                   <Form.Check
//                     type="checkbox"
//                     label="Timelines"
//                     name="timelines"
//                     checked={formData.timelines || false}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                   />
//                   <Form.Check
//                     type="checkbox"
//                     label="All Details Requested"
//                     name="details_requested"
//                     checked={formData.details_requested || false}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                   />
//                 </Col>
//               </Row>

//               {/* Grooming Section */}
//               <Row className="mb-3">
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>Grooming Needed</Form.Label>
//                     <Form.Select
//                       name="grooming_needed"
//                       value={formData.grooming_needed ? "Yes" : "No"}
//                       onChange={handleChange}
//                       disabled={!isEditing}
//                     >
//                       <option value="No">No</option>
//                       <option value="Yes">Yes</option>
//                     </Form.Select>
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>Grooming Instructions</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="grooming_instructions"
//                       value={formData.grooming_instructions || ""}
//                       readOnly={!isEditing}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>Grooming Done On</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="grooming_done_on"
//                       value={formData.grooming_done_on || ""}
//                       readOnly={!isEditing}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <Form.Group>
//                     <Form.Label>Grooming Done By</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="grooming_done_by"
//                       value={formData.grooming_done_by || ""}
//                       readOnly={!isEditing}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//             </Form>
//           )}
//         </Modal.Body>
//          <Modal.Footer className="d-flex justify-content-between">
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

// export default PendingQATable;



// check box code -----


// import { Table, Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { useState } from "react";

// const PendingQATable = ({ incidents, loading }) => {
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [selectedIncidents, setSelectedIncidents] = useState([]); // ✅ track selected incidents

//   const handleOpenModal = (incident) => {
//     setSelectedIncident(incident);
//     setFormData(incident);
//     setShowModal(true);
//     setIsEditing(false);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedIncident(null);
//     setIsEditing(false);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleEdit = () => setIsEditing(true);

//   const handleUpdate = () => {
//     console.log("✅ Updated Data:", formData);
//     // TODO: API call
//     setIsEditing(false);
//     setShowModal(false);
//   };

//   // ✅ Checkbox handling
//   const handleSelectIncident = (incidentNumber) => {
//     setSelectedIncidents((prev) =>
//       prev.includes(incidentNumber)
//         ? prev.filter((id) => id !== incidentNumber)
//         : [...prev, incidentNumber]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedIncidents.length === incidents.length) {
//       setSelectedIncidents([]); // unselect all
//     } else {
//       setSelectedIncidents(incidents.map((i) => i.incident_number));
//     }
//   };

//   return (
//     <div className="bg-white rounded shadow-sm p-3">
//       <h5 className="fw-bold mb-3">Pending QA</h5>
//       {loading ? (
//         <div className="text-center py-5">Loading...</div>
//       ) : (
//         <Table bordered hover responsive className="align-middle text-center">
//           <thead className="table-light">
//             <tr>
//               <th>  
//                 <Form.Check
                  
                  
//                   checked={
//                     incidents.length > 0 &&
//                     selectedIncidents.length === incidents.length
//                   }
//                   onChange={handleSelectAll}
//                   label="Select All"
//                   type="checkbox"
                  
//                 /> 
//               </th>
//               <th>Incident No</th>
//               <th>Handled By</th>
//               <th>Handled On</th>
//               <th>QC-Analyst</th>
//               <th>Current Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {incidents.length > 0 ? (
//               incidents.map((incident, index) => (
//                 <tr key={incident.sid || index}>
//                   <td>
//                     <Form.Check
//                       type="checkbox"
//                       checked={selectedIncidents.includes(
//                         incident.incident_number
//                       )}
//                       onChange={() =>
//                         handleSelectIncident(incident.incident_number)
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
//                   <td>{incident.assigned_analyst}</td>
//                   <td>{incident.incident_date}</td>
//                   <td>{incident.qc_analyst}</td>
//                   <td>{incident.resolution_status}</td>
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

//       {/* ✅ Full Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Pending QA</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {formData && (
//             <Form>
//               {/* Incident & Description */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Incident #</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="incident_number"
//                   value={formData.incident_number || ""}
//                   readOnly
//                 />
//               </Form.Group>
//               {/* ... keep all the same modal fields as in previous code ... */}
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

// export default PendingQATable;



import { Table, Modal, Button, Form, Row, Col, Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const PendingQATable = ({ incidents, loading }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedIncidents, setSelectedIncidents] = useState([]); // ✅ track selected
  const [users, setUsers] = useState([]); // ✅ user list from API
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users/get/list_users");
        setUsers(res.data || []);
        console.log("✅ UserList Response:", res.data);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleUpdate = () => {
    console.log("✅ Updated Data:", formData);
    // TODO: API call
    setIsEditing(false);
    setShowModal(false);
  };

  // ✅ Select individual incident
  const handleSelectIncident = (incidentNumber) => {
    setSelectedIncidents((prev) =>
      prev.includes(incidentNumber)
        ? prev.filter((id) => id !== incidentNumber)
        : [...prev, incidentNumber]
    );
  };

  // ✅ Select all
  const handleSelectAll = () => {
    if (selectedIncidents.length === incidents.length) {
      setSelectedIncidents([]); // unselect all
    } else {
      setSelectedIncidents(incidents.map((i) => i.incident_number));
    }
  };

  // ✅ Assign incidents
  const handleAssign = async () => {
    if (!selectedUser) {
      alert("⚠️ Please select a user first.");
      return;
    }
    if (selectedIncidents.length === 0) {
      alert("⚠️ Please select at least one incident.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/users/assign/incidents/", {
  user_sid: selectedUser,   // <-- use sid
  incidents: selectedIncidents,
});


      console.log("✅ Assign Response:", res.data);
      alert("Incidents assigned successfully!");
      setSelectedIncidents([]);
      setSelectedUser(null);
    } catch (error) {
      console.error("❌ Error assigning incidents:", error);
      alert("Failed to assign incidents.");
    }
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
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
    <option key={user.id} value={user.id}>
      {user.username}
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
              <th>
                <Form.Check
                  type="checkbox"
                  checked={
                    incidents.length > 0 &&
                    selectedIncidents.length === incidents.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Incident No</th>
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
                      checked={selectedIncidents.includes(incident.incident_number)}
                      onChange={() => handleSelectIncident(incident.incident_number)}
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
                  <td>{incident.assigned_analyst}</td>
                  <td>{incident.incident_date}</td>
                  <td>{incident.qc_analyst}</td>
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

      {/* ✅ Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Incident Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Incident #</Form.Label>
                    <Form.Control
                      type="text"
                      name="incident_number"
                      value={formData.incident_number || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="short_description"
                      value={formData.short_description || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* 👉 Add other modal fields as needed (Handled by, QA status, Grooming, etc.) */}
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

export default PendingQATable;
