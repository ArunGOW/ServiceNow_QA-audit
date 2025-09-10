 // src/components/layout/Topbar.jsx
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect after logout
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-3">
      <FaBars
        className="me-3"
        style={{ cursor: "pointer", fontSize: "1.5rem" }}
        onClick={onToggleSidebar}
      />
      <Navbar.Brand className="fw-bold">Dashboard</Navbar.Brand>
      <Nav className="ms-auto">
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            {user?.name || "Admin"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Topbar;
