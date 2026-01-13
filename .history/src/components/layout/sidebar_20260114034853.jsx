//  // src/components/layout/Sidebar.jsx
// import { NavLink } from "react-router-dom";
// import { FaStar } from "react-icons/fa";
// import "./Sidebar.css";
// import logo from "../../assets/download.png"; // Company logo

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       {/* Logo Section */}
//       {/* <div className="logo">
//         <img src={logo} alt="eServeCloudSolutions Logo" className="logo-img" />
//       </div> */}

//       {/* Navigation Links */}
//       <nav>
//         <NavLink to="/dashboard/pending-qa" activeClassName="active">
//           <FaStar /> My Pending QA
//         </NavLink>

//         <NavLink to="/dashboard/processed-qa" activeClassName="active">
//           <FaStar /> Processed QA
//         </NavLink>

//         <NavLink to="/dashboard/pending-grooming" activeClassName="active">
//           <FaStar /> Pending Grooming
//         </NavLink>

//         <NavLink to="/dashboard/import-incident" activeClassName="active">
//           <FaStar /> Import Incident
//         </NavLink>

//         <NavLink to="/dashboard/unassigned-incident" activeClassName="active">
//           <FaStar /> Unassigned Incident
//         </NavLink>
// {/* 
//         <NavLink to="/dashboard/user-dashboard" activeClassName="active">
//           <FaStar /> User Dashboard
//         </NavLink> */}
//         <NavLink to="/dashboard/alluser-dashboard" activeClassName="active">
//           <FaStar /> Dashboard
//         </NavLink>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./Sidebar.css";
import logo from "../../assets/download.png"; 

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      {/* Premium Logo Header */}
      <div className="sidebar-logo-section">
        <div className="logo-wrapper">
           <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
      </div>

      <div className="sidebar-divider"></div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">MAIN OPERATIONS</div>
        
        <NavLink to="/dashboard/pending-qa" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-box"><FaStar /></div>
          <span>My Pending QA</span>
        </NavLink>

        <NavLink to="/dashboard/processed-qa" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-box"><FaStar /></div>
          <span>Processed QA</span>
        </NavLink>

        <NavLink to="/dashboard/pending-grooming" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-box"><FaStar /></div>
          <span>Pending Grooming</span>
        </NavLink>

        <div className="nav-group-label mt-4">ADMINISTRATION</div>

        <NavLink to="/dashboard/import-incident" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-box"><FaStar /></div>
          <span>Import Incident</span>
        </NavLink>

        <NavLink to="/dashboard/unassigned-incident" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-box"><FaStar /></div>
          <span>Unassigned Incident</span>
        </NavLink>

        <NavLink to="/dashboard/alluser-dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-box"><FaStar /></div>
          <span>Analytics Dashboard</span>
        </NavLink>
      </nav>

      {/* Optional Footer User Info */}
      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">QA</div>
          <div className="user-name">Premium Tool</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;