// // src/components/layout/Topbar.jsx
// import { Navbar, Nav, Dropdown } from "react-bootstrap";
// import { FaBars } from "react-icons/fa";


// const Topbar = ({ onToggleSidebar }) => {
//   return (
//     <Navbar bg="light" expand="lg" className="shadow-sm px-3">
//       <FaBars
//         className="me-3"
//         style={{ cursor: "pointer", fontSize: "1.5rem" }}
//         onClick={onToggleSidebar}
//       />
//       <Navbar.Brand className="fw-bold">Dashboard</Navbar.Brand>
//       <Nav className="ms-auto">
//         <Dropdown align="end">
//           <Dropdown.Toggle variant="light" id="dropdown-basic">
//             Admin 
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item>Profile</Dropdown.Item>
//             <Dropdown.Item>Logout</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </Nav>
//     </Navbar>
//   );
// };

// export default Topbar;


// src/components/layout/Topbar.jsx
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import "./Topbar.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onToggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <FaBars className="menu-icon" onClick={onToggleSidebar} />
      <div className="brand">Dashboard</div>
      <Nav className="ms-auto">
        <Dropdown align="end" className="user-dropdown">
          <Dropdown.Toggle id="dropdown-basic">Admin</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </div>
  );
};

export default Topbar;
