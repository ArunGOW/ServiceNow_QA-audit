 import { NavLink } from "react-router-dom";
 import { FaShieldAlt, FaChartBar, FaClock, FaCheckCircle, FaLeaf, FaFileImport, FaExclamationCircle, FaEdit, FaHourglassHalf, FaTachometerAlt } from "react-icons/fa";
 import { useAuth } from "../../context/AuthContext";
 import { ROLES } from "../../constants/roles";
 import "../../assets/eServe_logo.png"
 import "./Sidebar.css";
 
 const iconMap = {
   "Dashboard": FaTachometerAlt,
   "My Pending QA": FaClock,
   "Processed QA": FaCheckCircle,
   "Pending Grooming": FaLeaf,
   "Import Incident": FaFileImport,
   "Unassigned Incident": FaExclamationCircle,
   "Update Incident": FaEdit,
   "Pending Incident": FaHourglassHalf,
 };
 
 const Sidebar = () => {
   const { user } = useAuth();
   if (!user) return null;
 
   const menu = [
     {
       title: "Management",
       roles: [ROLES.ADMIN],
       items: [
         { label: "Dashboard", path: "/dashboard/alluser-dashboard" },
         { label: "My Pending QA", path: "/dashboard/pending-qa" },
         { label: "Processed QA", path: "/dashboard/processed-qa" },
         { label: "Pending Grooming", path: "/dashboard/pending-grooming" },
         { label: "Import Incident", path: "/dashboard/import-incident" },
         { label: "Unassigned Incident", path: "/dashboard/unassigned-incident" },
       ],
     },
     {
       title: "General",
       roles: [ROLES.ADMIN, ROLES.AGENT],
       items: [
         { label: "Dashboard", path: "/dashboard/user-dashboard", roles: [ROLES.AGENT] },
         { label: "Update Incident", path: "/dashboard/update-incident" },
         { label: "Pending Incident", path: "/dashboard/pending-incident", roles: [ROLES.AGENT] },
       ],
     },
   ];
 
   const initials = user.user_type
     .replace("_", " ")
     .split(" ")
     .map((w) => w[0])
     .join("")
     .toUpperCase();
 
   return (
     <div className="sidebar">
       {/* Decorative background orbs */}
       <div className="sidebar-orb sidebar-orb--1" />
       <div className="sidebar-orb sidebar-orb--2" />
 
       {/* Header */}
      {/* Header */}
<div className="sidebar-header">
  <div className="logo-lockup">
    <div className="logo-img-wrap">
     <img
  src={eServe_logo}
  alt="eServe Cloud Solutions"
  className="logo-img"
/>
    </div>
   
  </div>
</div>
 
       {/* Divider */}
       <div className="sidebar-divider" />
 
       {/* User profile pill */}
       {/* <div className="user-profile">
         <div className="user-avatar">{initials}</div>
         <div className="user-info">
           <span className="user-name">{user.name || "User"}</span>
           <span className="user-role">{user.user_type.replace("_", " ")}</span>
         </div>
         <div className="user-status-dot" />
       </div> */}
 
       {/* Nav */}
       <nav className="sidebar-nav">
         {menu.map(
           (group) =>
             group.roles.includes(user.user_type) && (
               <div className="nav-group" key={group.title}>
                 <p className="group-label">
                   <span className="group-label-line" />
                   <span className="group-label-text">{group.title}</span>
                   <span className="group-label-line" />
                 </p>
 
                 {group.items
                   .filter((item) => !item.roles || item.roles.includes(user.user_type))
                   .map((item, idx) => {
                     const Icon = iconMap[item.label] || FaChartBar;
                     return (
                       <NavLink
                         key={item.path}
                         to={item.path}
                         style={{ "--item-index": idx }}
                         className={({ isActive }) =>
                           `nav-link-item${isActive ? " active" : ""}`
                         }
                       >
                         <span className="nav-icon-wrap">
                           <Icon className="nav-icon" />
                         </span>
                         <span className="nav-label">{item.label}</span>
                         <span className="nav-indicator" />
                       </NavLink>
                     );
                   })}
               </div>
             )
         )}
       </nav>
 
       {/* Footer */}
       <div className="sidebar-footer">
         <div className="footer-divider" />
         <p className="footer-text">QA Manager &copy; {new Date().getFullYear()}</p>
       </div>
     </div>
   );
 };
 
 export default Sidebar;
 