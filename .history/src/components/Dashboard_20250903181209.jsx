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


 


import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ImportExcelModal from "../components/ImportExcelModal";
import UserList from "../components/UserList";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 10;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch incidents
  const fetchIncidents = async (skip = 0) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/users/get/incidents?skip=${skip}&limit=${limit}`
      );
      console.log("Incidents:", res.data);
      setIncidents(res.data || []);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    }
  };

  // Run on page load + pagination
  useEffect(() => {
    fetchIncidents(page * limit);
  }, [page]);

  return (
    <>
      {/* Navbar */}
      <Navbar
        expand="lg"
        style={{ background: "linear-gradient(90deg, #0d6efd, #6610f2)" }}
        variant="dark"
        className="shadow-sm"
      >
        <Container>
          <Navbar.Brand className="fw-bold fs-4 text-white">
            Incident Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Navbar.Text className="me-3 text-white fw-semibold">
                👤 {user?.name || user?.email}{" "}
                <span className="badge bg-light text-dark ms-2">
                  {user?.role}
                </span>
              </Navbar.Text>

              {/* Import Excel Button */}
              <Button
                variant="outline-light"
                className="me-2 fw-semibold"
                onClick={() => setShowModal(true)}
              >
                📂 Import Excel
              </Button>

              <Button
                variant="danger"
                onClick={handleLogout}
                className="fw-semibold"
              >
                🚪 Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content */}
      <Container className="mt-5">
        <h2 className="fw-bold text-primary">
          Welcome, {user?.name || user?.email}
        </h2>
        <p className="text-muted">Role: {user?.role}</p>

        {/* Incident Table */}
        <div className="mt-4 p-3 border rounded bg-light shadow-sm">
          <h4 className="mb-3">📋 Uploaded Incidents</h4>
          {incidents.length === 0 ? (
            <p className="text-muted">No incidents found</p>
          ) : (
            <table className="table table-bordered table-striped">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.id}</td>
                    <td>{incident.title}</td>
                    <td>{incident.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-between mt-3">
            <Button
              variant="outline-primary"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ⬅️ Prev
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setPage((p) => p + 1)}
            >
              Next ➡️
            </Button>
          </div>
        </div>

        {/* Role Specific Content */}
        {user?.role === "QA Admin" && (
          <div className="p-3 mt-4 border rounded bg-light shadow-sm">
            <h4 className="text-danger">QA Admin Dashboard</h4>
            <p>Here you can view unaudited incidents and assign them to QA users.</p>
            <UserList />
          </div>
        )}
        {user?.role === "Agent" && (
          <div className="p-3 mt-4 border rounded bg-light shadow-sm">
            <h4 className="text-success">Agent Dashboard</h4>
            <p>Here you can view incidents marked as incorrectly processed by QA.</p>
          </div>
        )}
      </Container>

      {/* Import Excel Modal */}
      <ImportExcelModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onUploadSuccess={() => fetchIncidents(page * limit)} // 🔑 Refresh after upload
      />
    </>
  );
};

export default Dashboard;
