 // src/components/CustomNavbar.jsx
import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";

const CustomNavbar = ({ user, onLogout, onImport }) => {
  return (
    <Navbar
      expand="lg"
      style={{ background: "linear-gradient(90deg, #0d6efd, #6610f2)" }}
      variant="dark"
      className="shadow-sm"
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand className="fw-bold fs-4 text-white">
          INCIDENT MANAGEMENT
        </Navbar.Brand>

        {/* Mobile toggle */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* User Info */}
            <Navbar.Text className="me-3 text-white fw-semibold">
              👤 {user?.name || user?.email}{" "}
              <span className="badge bg-light text-dark ms-2">
                {user?.role}
              </span>
            </Navbar.Text>

            {/* ✅ Import Excel button (for all roles) */}
            <Button
              variant="outline-light"
              className="me-2 fw-semibold"
              onClick={onImport}
            >
              📂 Import Excel
            </Button>

            {/* Logout */}
            <Button
              variant="danger"
              onClick={onLogout}
              className="fw-semibold"
            >
              🚪 Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
