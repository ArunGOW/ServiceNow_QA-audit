
 // src/components/layout/Topbar.jsx


 import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

const Topbar = ({ onToggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
          <Dropdown.Toggle
            variant="light"
            id="dropdown-basic"
            className="d-flex align-items-center"
          >
            {user?.picture && (
              <Image
                src={user.picture}
                alt="Profile"
                roundedCircle
                width="32"
                height="32"
                className="me-2"
              />
            )}
            <span>{user?.name || user?.email || "Admin"}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item disabled>
              {user?.email || "No email"}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Topbar;
