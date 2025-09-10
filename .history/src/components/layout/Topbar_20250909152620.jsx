 // src/components/layout/Topbar.jsx
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({ onToggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

    const handleLogout = () => {
    // Clear any user data (localStorage/sessionStorage if used)
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    // Call context logout
    logout();

    // Redirect to login
    navigate("/login");
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
            Admin 
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Topbar;
