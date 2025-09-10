// import React, { useContext, useState } from "react";
// import { Container, Navbar, Nav, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import UserList from "../components/UserList";
// import ImportExcelModal from "../components/ImportExcelModal";

// const Dashboard = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <Navbar
//         expand="lg"
//         style={{
//           background: "linear-gradient(90deg, #0d6efd, #6610f2)",
//         }}
//         variant="dark"
//         className="shadow-sm"
//       >
//         <Container>
//           <Navbar.Brand className="fw-bold fs-4 text-white">
//             Incident Management
//           </Navbar.Brand>
//           <Navbar.Toggle aria-controls="navbar-nav" />
//           <Navbar.Collapse id="navbar-nav">
//             <Nav className="ms-auto align-items-center">
//               <Navbar.Text className="me-3 text-white fw-semibold">
//                 👤 {user?.name || user?.email}{" "}
//                 <span className="badge bg-light text-dark ms-2">
//                   {user?.role}
//                 </span>
//               </Navbar.Text>

//               {/* Import Excel button for both Agent & QA Admin */}
//               <Button
//                 variant="outline-light"
//                 className="me-2 fw-semibold"
//                 onClick={() => setShowModal(true)}
//               >
//                 📂 Import Excel
//               </Button>

//               {/* Logout */}
//               <Button
//                 variant="danger"
//                 onClick={handleLogout}
//                 className="fw-semibold"
//               >
//                 🚪 Logout
//               </Button>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Page Content */}
//       <Container className="mt-5">
//         <h2 className="fw-bold text-primary">
//           Welcome, {user?.name || user?.email}
//         </h2>
//         <p className="text-muted">Role: {user?.role}</p>

//         {/* Agent Dashboard */}
//         {user?.role === "Agent" && (
//           <div className="p-3 border rounded bg-light shadow-sm">
//             <h4 className="text-success">Agent Dashboard</h4>
//             <p>
//               Here you can view incidents marked as incorrectly processed by QA.
//             </p>
//             <p>Points and performance metrics will also be shown here.</p>
//           </div>
//         )}

//         {/* QA Admin Dashboard */}
//         {user?.role === "QA Admin" && (
//           <div className="p-3 border rounded bg-light shadow-sm">
//             <h4 className="text-danger">QA Admin Dashboard</h4>
//             <p>
//               Here you can view unaudited incidents and assign them to QA users.
//             </p>
//             <UserList />
//           </div>
//         )}
//       </Container>

//       {/* Import Excel Modal */}
//       <ImportExcelModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//       />
//     </>
//   );
// };

// export default Dashboard;


 


//  import React, { useContext, useEffect, useState } from "react";
// import { Container, Navbar, Nav, Button, Table, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
 
// import ImportExcelModal from "../components/ImportExcelModal";

// const Dashboard = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [skip, setSkip] = useState(0);
//   const limit = 10;

//   // Logout handler
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

  
//  // Fetch incidents API
// const fetchIncidents = async (skipVal = 0) => {
//   if (!user?.user_sid) {
//     console.warn("⚠️ No user_sid found, skipping incident fetch.");
//     return;
//   }
//   try {
//     setLoading(true);

//     const url = "http://127.0.0.1:8000/api/users/get/incidents?skip=0&limit=200";
//     console.log("📡 Fetching incidents from:", url);

//     const res = await axios.post(url, {
//       skip: skipVal,
//       limit: limit,
//       user_sid: user.user_sid,
//     });

//     console.log("✅ API Response Status:", res.status);
//     console.log("✅ API Response Data:", res.data);

//     setIncidents(res.data || []);
//   } catch (err) {
//     console.error("❌ Error fetching incidents:");
//     if (err.response) {
//       console.error("Status:", err.response.status);
//       console.error("Data:", err.response.data);
//       console.error("Headers:", err.response.headers);
//     } else {
//       console.error("Error Message:", err.message);
//     }
//   } finally {
//     setLoading(false);
//   }
// };



//   // Load incidents on login
//   useEffect(() => {
//     fetchIncidents(skip);
//   }, [user, skip]);

//   return (
//     <>
//       {/* Navbar */}
//       <Navbar
//         expand="lg"
//         style={{ background: "linear-gradient(90deg, #0d6efd, #6610f2)" }}
//         variant="dark"
//         className="shadow-sm"
//       >
//         <Container>
//           <Navbar.Brand className="fw-bold fs-4 text-white">
//              INCIDENT  MANAGEMENT
//           </Navbar.Brand>
//           <Navbar.Toggle aria-controls="navbar-nav" />
//           <Navbar.Collapse id="navbar-nav">
//             <Nav className="ms-auto align-items-center">
//               <Navbar.Text className="me-3 text-white fw-semibold">
//                 👤 {user?.name || user?.email}{" "}
//                 <span className="badge bg-light text-dark ms-2">
//                   {user?.role}
//                 </span>
//               </Navbar.Text>

//               <Button
//                 variant="outline-light"
//                 className="me-2 fw-semibold"
//                 onClick={() => setShowModal(true)}
//               >
//                 📂 Import Excel
//               </Button>

//               <Button
//                 variant="danger"
//                 onClick={handleLogout}
//                 className="fw-semibold"
//               >
//                 🚪 Logout
//               </Button>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Page Content */}
//       <Container className="mt-5">
//         <h2 className="fw-bold text-primary">
//           Welcome, {user?.name || user?.email}
//         </h2>
//         {/* <p className="text-muted">Role: {user?.role}</p> */}
//          {/* Agent Dashboard */}
//         {user?.role === "Agent" && (
//           <div className="mt-4 p-3 border rounded bg-white shadow-sm">
//             <h4 className="text-success">Agent Dashboard</h4>
//             <p>Here you can view incidents marked as incorrectly processed by QA.</p>
//           </div>
//         )}

//         {/* QA Admin Dashboard */}
//         {user?.role === "QA Admin" && (
//           <div className="mt-4 p-3 border rounded bg-white shadow-sm">
//             <h4 className="text-danger">QA Admin Dashboard</h4>
//             <p>Here you can view unaudited incidents and assign them to QA users.</p>
             
//           </div>
//         )}
 
       
//  {/* Incident Table */}
// <div className="mt-4 p-4 border rounded bg-white shadow-lg">
//   <h4 className="mb-4 text-center fw-bold text-primary">
//     📊  INCIDENT LIST
//   </h4>
//   {loading ? (
//     <div className="text-center py-5">
//       <Spinner animation="border" variant="primary" />
//     </div>
//   ) : incidents.length > 0 ? (
//     <>
//       <Table
//         bordered
//         hover
//         responsive
//         className="align-middle text-center shadow-sm"
//         style={{ borderRadius: "12px", overflow: "hidden" }}
//       >
//         <thead
//           style={{
//             background: "linear-gradient(90deg, #0d6efd, #6610f2)",
//             color: "white",
//           }}
//         >
//           <tr>
//             <th>INCIDENT NO</th>
//             <th>SHORT DESCRIPTION</th>
//             <th>STATUS</th>
//             <th>ASSIGNED TO </th>
//             <th>ANALYST</th>
//           </tr>
//         </thead>
//         <tbody>
//                         {console.log("all incidents",incidents)}

//           {incidents.map((incident, index) => (
//             <tr
//               key={index}
//               style={{
//                 transition: "all 0.3s ease-in-out",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.style.backgroundColor = "#f0f8ff")
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.style.backgroundColor = "white")
//               }
//             >
//               <td className="fw-semibold text-dark">
//                 {incident.incident_number || "N/A"}
//               </td>
//               <td className="text-muted">
//                 {incident.short_description || "N/A"}
//               </td>
//               <td>
//                 <span
//                   className={`badge ${
//                     incident.audit_status === "Completed"
//                       ? "bg-success"
//                       : incident.audit_status === "Pending"
//                       ? "bg-warning text-dark"
//                       : "bg-secondary"
//                   }`}
//                 >
//                   {incident.audit_status || "N/A"}
//                 </span>
//               </td>
//               <td>{incident.assigned_analyst || "Unassigned"}</td>
//               <td>{incident.qc_analyst || "NO"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Pagination */}
//        {/* Pagination */}
// {/* <div className="d-flex justify-content-center align-items-center mt-3">
//   <Button
//     variant="secondary"
//     className="me-2"
//     disabled={skip === 0}
//     onClick={() => setSkip(skip - limit)}
//   >
//     ⬅️ Previous
//   </Button>

//   <span className="fw-bold mx-2">
//     {Math.floor(skip / limit) + 1} / {Math.ceil(incidents.length / limit) || 1}
//   </span>

//   <Button
//     variant="secondary"
//     className="ms-2"
//     onClick={() => setSkip(skip + limit)}
//   >
//     Next ➡️
//   </Button>
// </div> */}

// {/* Pagination --1*/}
// <div 
//   className="d-flex justify-content-center align-items-center mt-3 pt-3 border-top"
// >
//   <Button
//     variant="outline-primary"
//     disabled={skip === 0}
//     onClick={() => setSkip(skip - limit)}
//     className="me-3"
//   >
//     ⬅️ Previous
//   </Button>

//   <span className="fw-semibold text-dark">
//     {Math.floor(skip / limit) + 1} / {Math.ceil(incidents.length / limit) || 1}
//   </span>

//   <Button
//     variant="outline-primary"
//     onClick={() => setSkip(skip + limit)}
//     className="ms-3"
//   >
//     Next ➡️
//   </Button>
// </div>


//     </>
//   ) : (
//     <p className="text-muted text-center py-4">No incidents found.</p>
//   )}
// </div>


 
       
//       </Container>

//       {/* Import Excel Modal */}
//       <ImportExcelModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         onUploadSuccess={() => fetchIncidents(skip)}
//       />
//     </>
//   );
// };

// export default Dashboard;



 


 import React, { useContext, useEffect, useState } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

import ImportExcelModal from "../components/ImportExcelModal";
import CustomNavbar from "../components/CustomNavbar";  
import PaginationControls from "../components/PaginationControls";  

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allIncidents, setAllIncidents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(allIncidents.length / limit) || 1;

  useEffect(() => {
    if (allIncidents.length > 0) {
      setIncidents(allIncidents.slice(skip, skip + limit));
    }
  }, [allIncidents, skip]);

  const handleNext = () => {
    if (skip + limit < allIncidents.length) setSkip(skip + limit);
  };

  const handlePrevious = () => {
    if (skip - limit >= 0) setSkip(skip - limit);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchIncidents = async () => {
    if (!user?.user_sid) return;
    try {
      setLoading(true);
      const url = "http://127.0.0.1:8000/api/users/get/incidents?skip=0&limit=200";
      const res = await axios.post(url, { user_sid: user.user_sid });
      setAllIncidents(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching incidents:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [user]);

  return (
    <>
      {/* ✅ Reusable Navbar */}
      <CustomNavbar
        user={user}
        onLogout={handleLogout}
        onImport={() => setShowModal(true)}
      />

      <Container className="mt-5">
        <h2 className="fw-bold text-primary">
          Welcome, {user?.name || user?.email}
        </h2>

        {/* Agent Dashboard */}
        {user?.role === "Agent" && (
          <div className="mt-4 p-3 border rounded bg-white shadow-sm">
            <h4 className="text-success">Agent Dashboard</h4>
            <p>Here you can view incidents marked as incorrectly processed by QA.</p>
          </div>
        )}

        {/* QA Admin Dashboard */}
        {user?.role === "QA Admin" && (
          <div className="mt-4 p-3 border rounded bg-white shadow-sm">
            <h4 className="text-danger">QA Admin Dashboard</h4>
            <p>Here you can view unaudited incidents and assign them to QA users.</p>
          </div>
        )}

        {/* Incident Table */}
        <div className="mt-4 p-4 border rounded bg-white shadow-lg">
          <h4 className="mb-4 text-center fw-bold text-primary">📊 INCIDENT LIST</h4>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : incidents.length > 0 ? (
            <>
               

              {/* ✅ Pagination */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
              />
            </>
          ) : (
            <p className="text-muted text-center py-4">No incidents found.</p>
          )}
        </div>
      </Container>

      {/* Import Excel Modal */}
      <ImportExcelModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onUploadSuccess={() => fetchIncidents()}
      />
    </>
  );
};

export default Dashboard;

