// // src/components/layout/Topbar.jsx
// import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
// import { FaBars } from "react-icons/fa";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import "./Topbar.css";

// const Topbar = ({ onToggleSidebar }) => {
//   const { logout, user } = useAuth();
//   const navigate = useNavigate();

//   // Handle user logout
//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <Navbar bg="light" expand="lg" className="shadow-sm px-3">
//       {/* Sidebar Toggle */}
//       <FaBars
//         className="me-3"
//         style={{ cursor: "pointer", fontSize: "1.5rem" }}
//         onClick={onToggleSidebar}
//       />

//       {/* Title */}
//       <Navbar.Brand className="fw-bold">Dashboard</Navbar.Brand>

//       {/* User Menu */}
//       <Nav className="ms-auto">
//         <Dropdown align="end">
//           <Dropdown.Toggle
//             variant="light"
//             id="dropdown-basic"
//             className="d-flex align-items-center"
//           >
//             {user?.picture && (
//               <Image
//                 src={user.picture}
//                 alt="Profile"
//                 roundedCircle
//                 width="32"
//                 height="32"
//                 className="me-2"
//               />
//             )}
//             <span>{user?.name || user?.email || "Admin"}</span>
//           </Dropdown.Toggle>

//           <Dropdown.Menu>
//             <Dropdown.Item disabled>
//               {user?.email || "No email"}
//             </Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </Nav>
//     </Navbar>
//   );
// };

// export default Topbar;


import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { HiMenuAlt2 } from "react-icons/hi"; // A more modern "Bars" icon
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi"; // Premium line icons
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
    <Navbar className="topbar-custom px-4">
      {/* Left Section: Toggle & Title */}
      <div className="d-flex align-items-center">
        <div className="sidebar-toggle-btn me-3" onClick={onToggleSidebar}>
          <HiMenuAlt2 size={24} />
        </div>
        <Navbar.Brand className="brand-text d-none d-sm-block">
          Dashboard
        </Navbar.Brand>
      </div>

      {/* Right Section: User Menu */}
      <Nav className="ms-auto">
        <Dropdown align="end">
          <Dropdown.Toggle id="dropdown-user-profile" className="profile-dropdown-toggle">
            <div className="user-info-wrapper">
              <div className="user-text-meta d-none d-md-flex">
                <span className="user-name">{user?.name || "Admin"}</span>
                <header className="dashboard-header">
        <h2>System Overview</h2>
        
        {/* The Role Badge */}
        <div className={`role-badge ${user?.user_type}`}>
          <span className="pulse-dot"></span>
          {user?.user_type === "qa_admin" ? "QA Administrator" : "Agent Access"}
        </div>
      </header>
              </div>
              <div className="avatar-container">
                {user?.picture ? (
                  <Image src={user.picture} roundedCircle className="profile-img" />
                ) : (
                  <div className="avatar-placeholder">
                    {(user?.name || "A").charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="profile-dropdown-menu shadow-lg border-0 mt-2">
            <div className="dropdown-header-custom px-3 py-2">
              <p className="mb-0 small text-muted">Signed in as</p>
              <p className="mb-0 fw-bold">{user?.email || "admin@example.com"}</p>
            </div>
            <Dropdown.Divider />
            <Dropdown.Item className="py-2"><FiUser className="me-2" /> Profile</Dropdown.Item>
            <Dropdown.Item className="py-2"><FiSettings className="me-2" /> Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="py-2 text-danger">
              <FiLogOut className="me-2" /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Topbar;