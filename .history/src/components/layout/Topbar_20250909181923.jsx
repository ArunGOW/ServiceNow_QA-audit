 // src/components/layout/Topbar.jsx
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onToggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm px-3"
      style={{
        background: "linear-gradient(135deg, #6f42c1, #0d6efd)", // MopUp purple-blue gradient
      }}
    >
      {/* Sidebar Toggle Button */}
      <FaBars
        className="me-3 text-white"
        style={{
          cursor: "pointer",
          fontSize: "1.8rem",
          padding: "8px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.15)",
          transition: "0.3s",
        }}
        onClick={onToggleSidebar}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")
        }
      />

      <Navbar.Brand className="fw-bold text-white">Dashboard</Navbar.Brand>

      <Nav className="ms-auto">
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            id="dropdown-basic"
            className="fw-semibold"
          >
            Admin
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
