 import React, { useContext, useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserList from "../components/UserList";
import ImportExcel from "../components/ImportExcel"; // Import Excel component

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect back to login page
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand className="fw-bold text-light">
            Incident Management
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            <Navbar.Text className="me-3 text-light">
              Signed in as:{" "}
              <strong>{user?.name || user?.email}</strong> ({user?.role})
            </Navbar.Text>

            {/* Import Excel - visible for both roles */}
            <Button
              variant="outline-info"
              className="me-2"
              onClick={() => setShowModal(true)}
            >
              📂 Import Excel
            </Button>

            {/* Logout */}
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Page Content */}
      <Container className="mt-5">
        <h2>Welcome, {user?.name || user?.email}</h2>
        <p>Role: {user?.role}</p>

        {/* Agent Dashboard */}
        {user?.role === "Agent" && (
          <div className="p-3 bg-light rounded shadow-sm">
            <h4>Agent Dashboard</h4>
            <p>
              Here you can view incidents marked as incorrectly processed by QA.
            </p>
            <p>Points and performance metrics will also be shown here.</p>
          </div>
        )}

        {/* QA Admin Dashboard */}
        {user?.role === "QA Admin" && (
          <div className="p-3 bg-light rounded shadow-sm">
            <h4>QA Admin Dashboard</h4>
            <p>
              Here you can view unaudited incidents and assign them to QA users.
            </p>
            <UserList />
          </div>
        )}
      </Container>

      {/* Import Excel Modal */}
      <ImportExcel show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

export default Dashboard;
