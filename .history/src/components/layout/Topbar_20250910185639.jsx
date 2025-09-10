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
import { useAuth } from "../../context/AuthContext";   // ✅ import hook
import { useNavigate } from "react-router-dom";
import './Topbar.css'

const Topbar = ({ onToggleSidebar }) => {
  const { logout, user } = useAuth();  //  get user + logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();            // clear user + localStorage
    navigate("/login");  // redirect to login page
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
            {user?.name || "Admin"}  {/*  show logged-in user name */}
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

