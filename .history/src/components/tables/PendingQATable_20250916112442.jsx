// //  // src/components/tables/PendingQATable.jsx
// // import { Table, Spinner, Badge } from "react-bootstrap";

// //  const PendingQATable = ({ incidents, loading }) => {

// //   console.log("🟢 Pending Incidents passed to table:", incidents);

// //   if (loading) return <p>Loading...</p>;

// //   if (!incidents || incidents.length === 0) {
// //     return <p>No pending incidents found.</p>;
// //   }
// //   useEffect(() => {
// //   const fetchData = async () => {
// //     if (!user?.user_sid) {
// //       console.warn("⚠️ No user_sid found, skipping fetch.");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const skip = (currentPage - 1) * limit;

// //       const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
// //         user_sid: user.user_sid,
// //         skip,
// //         limit,
// //       });

// //       console.log("📌 Full API Response:", res.data);

// //       const allIncidents = res.data?.incidents || [];
// //       console.log("allIncidents data",allIncidents)

// //       // 🔎 Log audit_status of each incident
// //       console.log("🔍 audit_status values from API:", allIncidents.map(i => i.audit_status));

// //       setPendingIncidents(
// //         allIncidents.filter((i) => i.audit_status?.toLowerCase() === "pending")
// //       );
// //       setProcessedIncidents(
// //         allIncidents.filter((i) => i.audit_status?.toLowerCase() === "completed")
// //       );

// //       if (res.data?.totalCount) {
// //         setTotalPages(Math.ceil(res.data.totalCount / limit));
// //       }
// //     } catch (error) {
// //       console.error("❌ Error fetching incidents:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchData();
// // }, [currentPage, user]);


// //   return (
// //      <Table>
// //   <thead>
// //     <tr>
// //       <th>Incident #</th>
// //       <th>Handled By</th>
// //       <th>Handled On</th>
// //       <th>Current Status</th>
// //     </tr>
// //   </thead>
// //   <tbody>

// //     {console.log("pendingIncidents",incidents)}
// //     {incidents.length > 0 ? (
// //       incidents.map((incident, index) => (
// //         <tr key={incident.id || index}>
// //           <td>{incident.incident_number || "N/A"}</td>
// //           <td>{incident.handled_by || "N/A"}</td>
// //           <td>{incident.handled_on ? new Date(incident.handled_on).toLocaleDateString() : "N/A"}</td>
// //           <td>{incident.audit_status || "N/A"}</td>
// //         </tr>
// //       ))
// //     ) : (
// //       <tr>
// //         <td colSpan="4" style={{ textAlign: "center" }}>
// //           No Pending Incidents Found
// //         </td>
// //       </tr>
// //     )}
// //   </tbody>
// // </Table>

// //   );
// // };


// // export default PendingQATable;

// import React, { useEffect, useState } from "react";

// const PendingQATable = ({ incidents, loading }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     setData(incidents);
//   }, [incidents]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <table border="1" width="100%">
//       <thead>
//         <tr>
//           <th>Incident No</th>
//           <th>Handled By</th>
//           <th>Handled On</th>
//           <th>Current Status</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((incident, idx) => (
//           <tr key={idx}>
//             <td>{incident. incident_number
// }</td>
//             <td>{incident.assigned_analyst
// }</td>
// <td>{incident.incident_date
// }</td>
//             <td>{incident.audit_status}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default PendingQATable;


//  import { Table, Spinner } from "react-bootstrap";

// const PendingQATable = ({ incidents, loading }) => {
//   console.log("📌 Pending incidents passed to table:", incidents);

//   return (
//     <div className="bg-white rounded shadow-sm p-3">
//       <h5 className="fw-bold mb-3">Pending QA</h5>
//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <Table bordered hover responsive className="align-middle text-center">
//           <thead className="table-light">
//             <tr>
//               <th>Incident No</th>
//               <th>Handled By</th>
//               <th>Incident Date</th>
//               <th>Audit Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {incidents.length > 0 ? (
//               incidents.map((incident, index) => (
//                 <tr key={incident.sid || index}>
//                   <td>{incident.incident_number}</td>
//                   <td>{incident.assigned_analyst}</td>
//                   <td>{incident.incident_date}</td>
//                   <td>{incident.audit_status || "N/A"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4">No pending QA records found.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default PendingQATable;

import { Table, Spinner, Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

const PendingQATable = ({ incidents, loading }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleOpenModal = (incident) => {
    setSelectedIncident(incident);
    setFormData(incident); // pre-fill form
    setShowModal(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = () => {
    console.log("✅ Updated Data:", formData);
    // TODO: API call to update backend
    setIsEditing(false);
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-3">
      <h5 className="fw-bold mb-3">Pending QA</h5>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
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
                  <td
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleOpenModal(incident)}
                  >
                    {incident.incident_number}
                  </td>
                  <td>{incident.assigned_analyst}</td>
                  <td>{incident.incident_date}</td>
                  <td>{incident.qc_analyst}</td>
                  <td>{incident.resolution_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No processed QA records found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* ✅ Modal Popup */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pending QA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formData && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Incident #</Form.Label>
                <Form.Control
                  type="text"
                  name="incident_number"
                  value={formData.incident_number || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Handled by</Form.Label>
                <Form.Control
                  type="text"
                  name="assigned_analyst"
                  value={formData.assigned_analyst || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Handled on</Form.Label>
                <Form.Control
                  type="text"
                  name="incident_date"
                  value={formData.incident_date || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Current status</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="audit_status"
                  value={formData.audit_status || ""}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </Form.Group>
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
