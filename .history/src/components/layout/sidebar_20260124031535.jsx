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

     // premium design add code 


// src/components/layout/Sidebar.jsx
// import { NavLink } from "react-router-dom";
// import { FaStar } from "react-icons/fa";
// import "./Sidebar.css";
// import logo from "../../assets/download.png"; 

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       {/* Logo Section */}
//       {/* <div className="logo-section">
//         <img src={logo} alt="eServeCloudSolutions Logo" className="logo-img" />
//       </div> */}

//       <div className="sidebar-divider"></div>

//       {/* Navigation Links */}
//       <nav className="sidebar-nav">
         
        
//         <NavLink to="/dashboard/pending-qa" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//           <FaStar className="star-icon" /> <span>My Pending QA</span>
//         </NavLink>

//         <NavLink to="/dashboard/processed-qa" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//           <FaStar className="star-icon" /> <span>Processed QA</span>
//         </NavLink>

//         <NavLink to="/dashboard/pending-grooming" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//           <FaStar className="star-icon" /> <span>Pending Grooming</span>
//         </NavLink>

         

//         <NavLink to="/dashboard/import-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//           <FaStar className="star-icon" /> <span>Import Incident</span>
//         </NavLink>

//         <NavLink to="/dashboard/unassigned-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//           <FaStar className="star-icon" /> <span>Unassigned Incident</span>
//         </NavLink>

//         <NavLink to="dashboard/update-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//           <FaStar className="star-icon" /> <span>UpdateIncident</span>
//         </NavLink>

//         <NavLink to="/dashboard/alluser-dashboard" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//           <FaStar className="star-icon" /> <span>Dashboard</span>
//         </NavLink>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


// // src/components/layout/Sidebar.jsx
// import { NavLink } from "react-router-dom";
// import { FaStar } from "react-icons/fa";
// import { useAuth } from "../../context/AuthContext";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const { user } = useAuth();

//   if (!user) return null; // Hide sidebar if not logged in

//   const isAdmin = user.user_type === "qa_admin";
//   const isAgent = user.user_type === "agent";

//   return (
//     <div className="sidebar">
//       <div className="sidebar-divider"></div>

//       <nav className="sidebar-nav">

//         {/* QA Admin sees all items */}
//         {isAdmin && (
//           <>
//             <NavLink
//               to="pending-qa"
//               className={({ isActive }) =>
//                 isActive ? "nav-link-item active" : "nav-link-item"
//               }
//             >
//               <FaStar className="star-icon" /> <span>My Pending QA</span>
//             </NavLink>

//             <NavLink
//               to="processed-qa"
//               className={({ isActive }) =>
//                 isActive ? "nav-link-item active" : "nav-link-item"
//               }
//             >
//               <FaStar className="star-icon" /> <span>Processed QA</span>
//             </NavLink>

//             <NavLink
//               to="pending-grooming"
//               className={({ isActive }) =>
//                 isActive ? "nav-link-item active" : "nav-link-item"
//               }
//             >
//               <FaStar className="star-icon" /> <span>Pending Grooming</span>
//             </NavLink>

//             <NavLink
//               to="import-incident"
//               className={({ isActive }) =>
//                 isActive ? "nav-link-item active" : "nav-link-item"
//               }
//             >
//               <FaStar className="star-icon" /> <span>Import Incident</span>
//             </NavLink>

//             <NavLink
//               to="unassigned-incident"
//               className={({ isActive }) =>
//                 isActive ? "nav-link-item active" : "nav-link-item"
//               }
//             >
//               <FaStar className="star-icon" /> <span>Unassigned Incident</span>
//             </NavLink>
//           </>
//         )}

//         {/* Both Admin and Agent can see these */}
//         {(isAdmin || isAgent) && (
//           <>
//             <NavLink
//               to="update-incident"
//               className={({ isActive }) =>
//                 isActive ? "nav-link-item active" : "nav-link-item"
//               }
//             >
//               <FaStar className="star-icon" /> <span>Update Incident</span>
//             </NavLink>

//             <NavLink
//               to="alluser-dashboard"
//               className={({ isActive }) =>
//                 isActive ? "nav-link-item active" : "nav-link-item"
//               }
//             >
//               <FaStar className="star-icon" /> <span>Dashboard</span>
//             </NavLink>
//           </>
//         )}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


// // src/components/layout/Sidebar.jsx
// import { NavLink } from "react-router-dom";
// import { FaStar, FaShieldAlt } from "react-icons/fa"; // Added a shield icon for the logo
// import { useAuth } from "../../context/AuthContext";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const { user } = useAuth();

//   if (!user) return null;

//   const isAdmin = user.user_type === "qa_admin";
//   const isAgent = user.user_type === "agent";

//   return (
//     <div className="sidebar">
//       {/* Premium Logo/Banner Section */}
//       <div className="sidebar-header">
//         <div className="logo-container">
//           <FaShieldAlt className="logo-icon" />
//           <span className="logo-text">QA<span className="logo-dash">-</span>TOOL</span>
//         </div>
//         <div className="user-badge">{user.user_type?.replace('_', ' ')}</div>
//       </div>

//       <div className="sidebar-divider"></div>

//       <nav className="sidebar-nav">
//         {/* QA Admin Items */}
//         {isAdmin && (
//           <div className="nav-group">
//             <p className="group-title">Management</p>
//             <NavLink to="pending-qa" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//               <FaStar className="star-icon" /> <span>My Pending QA</span>
//             </NavLink>
//             <NavLink to="processed-qa" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//               <FaStar className="star-icon" /> <span>Processed QA</span>
//             </NavLink>
//             <NavLink to="pending-grooming" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//               <FaStar className="star-icon" /> <span>Pending Grooming</span>
//             </NavLink>
//             <NavLink to="import-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//               <FaStar className="star-icon" /> <span>Import Incident</span>
//             </NavLink>
//             <NavLink to="unassigned-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//               <FaStar className="star-icon" /> <span>Unassigned Incident</span>
//             </NavLink>
//           </div>
//         )}

//         {/* Shared Items */}
//         {(isAdmin || isAgent) && (
//           <div className="nav-group">
//             <p className="group-title">General</p>
//             <NavLink to="update-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//               <FaStar className="star-icon" /> <span>Update Incident</span>
//             </NavLink>
//             <NavLink to="alluser-dashboard" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
//               <FaStar className="star-icon" /> <span>Dashboard</span>
//             </NavLink>
//           </div>
//         )}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaStar, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const isAdmin = user.user_type === "qa_admin";
  const isAgent = user.user_type === "agent";

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <FaShieldAlt className="logo-icon" />
          <span className="logo-text">QA<span className="logo-dash">-</span>TOOL</span>
        </div>
        <div className="user-badge">{user.user_type?.replace('_', ' ')}</div>
      </div>

      <nav className="sidebar-nav">
        {isAdmin && (
          <div className="nav-group">
            <p className="group-title">Management</p>
            <NavLink to="/dashboard/pending-qa" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
              <FaStar className="star-icon" /> <span>My Pending QA</span>
            </NavLink>
            <NavLink to="/dashboard/processed-qa" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
              <FaStar className="star-icon" /> <span>Processed QA</span>
            </NavLink>
            <NavLink to="/dashboard/pending-grooming" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
              <FaStar className="star-icon" /> <span>Pending Grooming</span>
            </NavLink>
            <NavLink to="/dashboard/import-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
              <FaStar className="star-icon" /> <span>Import Incident</span>
            </NavLink>
            <NavLink to="/dashboard/unassigned-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
              <FaStar className="star-icon" /> <span>Unassigned Incident</span>
            </NavLink>
            <NavLink to="/dashboard/alluser-dashboard" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
              <FaStar className="star-icon" /> <span>Dashboard</span>
            </NavLink>
          </div>
        )}

        {(isAgent) && (
          <div className="nav-group">
            <p className="group-title">General</p>
            <NavLink to="/dashboard/update-incident" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
              <FaStar className="star-icon" /> <span>Update Incident</span>
            </NavLink>
            <NavLink to="/dashboard/user-dashboard" className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}>
              <FaStar className="star-icon" /> <span>Dashboards</span>
            </NavLink>


          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;