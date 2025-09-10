 // src/components/CustomNavbar.jsx
import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import CustomButton from "./CustomButton";

const CustomNavbar = ({ user, onLogout, onImport }) => {
  return (
    <Navbar
      expand="lg"
      style={{ background: "linear-gradient(90deg, #0d6efd, #6610f2)" }}
      variant="dark"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand className="fw-bold fs-4 text-white">
          INCIDENT MANAGEMENT
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Navbar.Text className="me-3 text-white fw-semibold">
              👤 {user?.name || user?.email}{" "}
              <span className="badge bg-light text-dark ms-2">{user?.role}</span>
            </Navbar.Text>

            {/* Import Excel */}
            <CustomButton
              variant="outline-light"
              className="me-2"
              onClick={onImport}
            >
              📂 Import Excel
            </CustomButton>

            {/* Logout */}
            <CustomButton variant="danger" onClick={onLogout}>
              🚪 Logout
            </CustomButton>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
