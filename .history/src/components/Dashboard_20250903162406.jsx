 import React, { useContext } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserList from "../components/UserList";
import ImportExcel from "../components/ImportExcel"; // Import Excel component

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect back to login page
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Incident Management</Navbar.Brand>
          <Nav className="ms-auto">
            <Navbar.Text className="me-3">
              Signed in as: <strong>{user?.name || user?.email}</strong> ({user?.role})
            </Navbar.Text>
            <Button
              variant="outline-light"
              className="me-2"
              onClick={() => navigate("/import-excel")}
            >
              Import Excel
            </Button>
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
          <div>
            <h4>Agent Dashboard</h4>
            <p>Here you can view incidents marked as incorrectly processed by QA.</p>
            <p>Points and performance metrics will also be shown here.</p>
            {/* Later: Show incidents & points */}
          </div>
        )}

        {/* QA Admin Dashboard */}
        {user?.role === "QA Admin" && (
          <div>
            <h4>QA Admin Dashboard</h4>
            <p>Here you can view unaudited incidents and assign them to QA users.</p>
            <UserList />
            {/* Later: Add assign functionality */}
          </div>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
