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
import { Container, Navbar, Nav, Button, Table, Pagination, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserList from "../components/UserList";
import ImportExcelModal from "../components/ImportExcelModal";
import axios from "axios";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 10; // page size

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch incidents from API
  const fetchIncidents = async (skip = 0) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/api/users/get/incidents?skip=${skip}&limit=${limit}&user_sid=${user?.user_sid}`
      );
      console.log("Incidents API Response:", res.data);
      setIncidents(res.data || []);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_sid) {
      fetchIncidents(page * limit);
    }
  }, [user, page]);

  return (
    <>
      {/* Navbar */}
      <Navbar
        expand="lg"
        style={{
          background: "linear-gradient(90deg, #0d6efd, #6610f2)",
        }}
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
                <span className="badge bg-light text-dark ms-2">{user?.role}</span>
              </Navbar.Text>

              <Button
                variant="outline-light"
                className="me-2"
                onClick={() => setShowModal(true)}
              >
                📂 Import Excel
              </Button>
              <Button variant="danger" onClick={handleLogout} className="fw-semibold">
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

        {/* Agent Dashboard */}
        {user?.role === "Agent" && (
          <div className="p-3 border rounded bg-light shadow-sm mb-4">
            <h4 className="text-success">Agent Dashboard</h4>
            <p>Here you can view incidents marked as incorrectly processed by QA.</p>
          </div>
        )}

        {/* QA Admin Dashboard */}
        {user?.role === "QA Admin" && (
          <div className="p-3 border rounded bg-light shadow-sm mb-4">
            <h4 className="text-danger">QA Admin Dashboard</h4>
            <p>Here you can view unaudited incidents and assign them to QA users.</p>
            <UserList />
          </div>
        )}

        {/* Incidents Table */}
        <div className="p-3 border rounded bg-white shadow-sm">
          <h4 className="mb-3">📊 Incidents</h4>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : incidents.length > 0 ? (
            <>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident, idx) => (
                    <tr key={idx}>
                      <td>{incident.id}</td>
                      <td>{incident.title}</td>
                      <td>{incident.status}</td>
                      <td>{incident.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <Pagination className="justify-content-center mt-3">
                <Pagination.Prev
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                />
                <Pagination.Item active>{page + 1}</Pagination.Item>
                <Pagination.Next onClick={() => setPage((p) => p + 1)} />
              </Pagination>
            </>
          ) : (
            <p className="text-muted">No incidents found.</p>
          )}
        </div>
      </Container>

      {/* Import Excel Modal */}
      <ImportExcelModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

export default Dashboard;
