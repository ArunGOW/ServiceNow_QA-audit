 

// import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
// import { HiMenuAlt2 } from "react-icons/hi"; // A more modern "Bars" icon
// import { FiLogOut, FiUser, FiSettings } from "react-icons/fi"; // Premium line icons
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import "./Topbar.css";

 

// const Topbar = ({ onToggleSidebar }) => {
//   const { logout, user } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <Navbar className="topbar-custom px-4 sticky-top">
//       <div className="d-flex align-items-center">
//         <div className="sidebar-toggle-btn me-3" onClick={onToggleSidebar}>
//           <HiMenuAlt2 size={24} />
//         </div>
//         <Navbar.Brand className="brand-text d-none d-sm-block">
//           Dashboard
//         </Navbar.Brand>
//       </div>

//       <Nav className="ms-auto">
//         <Dropdown align="end">
//           <Dropdown.Toggle id="dropdown-user-profile" className="profile-dropdown-toggle">
//             <div className="user-info-wrapper">
//               <div className="user-text-meta d-none d-md-flex">
//                 <span className="user-name">{user?.name || "User"}</span>
//                 {/* Clean, Premium Badge Implementation */}
//                 <div className={`premium-badge ${user?.user_type}`}>
//                   <span className="pulse-dot"></span>
//                   <span className="badge-label">
//                     {user?.user_type === "qa_admin" ? "QA Admin" : "Agent"}
//                   </span>
//                 </div>
//               </div>
//               <div className="avatar-container">
//                 {user?.picture ? (
//                   <Image src={user.picture} roundedCircle className="profile-img" />
//                 ) : (
//                   <div className="avatar-placeholder">
//                     {(user?.name || "A").charAt(0)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Dropdown.Toggle>

//           <Dropdown.Menu className="profile-dropdown-menu shadow-lg border-0 mt-2">
//             <div className="dropdown-header-custom px-3 py-2">
//               <p className="mb-0 small text-muted">Signed in as</p>
//               <p className="mb-0 fw-bold">{user?.email || "user@example.com"}</p>
//             </div>
//             <Dropdown.Divider />
//             <Dropdown.Item className="py-2"><FiUser className="me-2" /> Profile</Dropdown.Item>
//             <Dropdown.Item className="py-2"><FiSettings className="me-2" /> Settings</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleLogout} className="py-2 text-danger">
//               <FiLogOut className="me-2" /> Logout
//             </Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </Nav>
//     </Navbar>
//   );
// };

// export default Topbar;

import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { HiMenuAlt2 } from "react-icons/hi";
import { FiLogOut, FiUser, FiSettings, FiBell } from "react-icons/fi";
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
    <Navbar className="topbar-custom px-4 sticky-top">
      {/* Decorative gradient line at the bottom */}
      <div className="topbar-gradient-line"></div>

      <div className="d-flex align-items-center">
        <button
          className="sidebar-toggle-btn me-3"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <HiMenuAlt2 size={22} />
        </button>
        <Navbar.Brand className="brand-text d-none d-sm-block">
          <span className="brand-icon">✦</span>
          Dashboard
        </Navbar.Brand>
      </div>

      <Nav className="ms-auto align-items-center gap-2">
        {/* Notification Bell */}
        <button className="icon-btn" aria-label="Notifications">
          <FiBell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-divider d-none d-md-block"></div>

        <Dropdown align="end">
          <Dropdown.Toggle
            id="dropdown-user-profile"
            className="profile-dropdown-toggle"
          >
            <div className="user-info-wrapper">
              <div className="user-text-meta d-none d-md-flex">
                <span className="user-name">{user?.name || "User"}</span>
                <div className={`premium-badge ${user?.user_type}`}>
                  <span className="pulse-dot"></span>
                  <span className="badge-label">
                    {user?.user_type === "qa_admin" ? "QA Admin" : "Agent"}
                  </span>
                </div>
              </div>
              <div className="avatar-container">
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    roundedCircle
                    className="profile-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {(user?.name || "A").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="avatar-status-ring"></span>
              </div>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="profile-dropdown-menu border-0 mt-2">
            <div className="dropdown-header-custom">
              <div className="header-avatar">
                {user?.picture ? (
                  <Image src={user.picture} roundedCircle />
                ) : (
                  <div className="header-avatar-placeholder">
                    {(user?.name || "A").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="header-info">
                <p className="header-name">{user?.name || "User"}</p>
                <p className="header-email">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <div className="dropdown-divider-custom"></div>

            <Dropdown.Item className="dropdown-item-custom">
              <FiUser className="dropdown-icon" /> 
              <span>Profile</span>
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item-custom">
              <FiSettings className="dropdown-icon" /> 
              <span>Settings</span>
            </Dropdown.Item>

            <div className="dropdown-divider-custom"></div>

            <Dropdown.Item
              onClick={handleLogout}
              className="dropdown-item-custom logout-item"
            >
              <FiLogOut className="dropdown-icon" /> 
              <span>Logout</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default Topbar;