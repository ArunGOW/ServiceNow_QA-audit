 import React, { useContext, useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserList from "../components/UserList";
import ImportExcelModal from "../components/ImportExcelModal";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
                <span className="badge bg-light text-dark ms-2">
                  {user?.role}
                </span>
              </Navbar.Text>

              {user?.role === "QA Admin" && (
                <Button
                  variant="outline-light"
                  className="me-2"
                  onClick={() => setShowModal(true)}
                >
                  📂 Import Excel
                </Button>
              )}

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

        {/* Agent Dashboard */}
        {user?.role === "Agent" && (
          <div className="p-3 border rounded bg-light shadow-sm">
            <h4 className="text-success">Agent Dashboard</h4>
            <p>Here you can view incidents marked as incorrectly processed by QA.</p>
            <p>Points and performance metrics will also be shown here.</p>
          </div>
        )}

        {/* QA Admin Dashboard */}
        {user?.role === "QA Admin" && (
          <div className="p-3 border rounded bg-light shadow-sm">
            <h4 className="text-danger">QA Admin Dashboard</h4>
            <p>Here you can view unaudited incidents and assign them to QA users.</p>
            <UserList />
          </div>
        )}
      </Container>

      {/* Import Excel Modal */}
      <ImportExcelModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};

export default Dashboard;
