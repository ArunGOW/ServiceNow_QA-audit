 import { NavLink } from "react-router-dom";
import { FaStar, FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";
import "./Sidebar.css";

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const menu = [
    {
      title: "General",
      roles: [ROLES.ADMIN, ROLES.AGENT],
      items: [
       {
        label:"Dashboard",
        path:"/dashboard/user-dashboard",
        roles: [ROLES.AGENT],
       },
        {
          label: "Update Incident",
          path: "/dashboard/update-incident",
        },
         {
          label: "Pending Incident",
          path: "/dashboard/pending-incident",
          roles: [ROLES.AGENT],
        },
      ],
    },
    {
      title: "Management",
      roles: [ROLES.ADMIN],
      items: [
         {
          label: "Dashboard",
          path: "/dashboard/alluser-dashboard",
        },
        {
          label: "My Pending QA",
          path: "/dashboard/pending-qa",
        },
        {
          label: "Processed QA",
          path: "/dashboard/processed-qa",
        },
        {
          label: "Pending Grooming",
          path: "/dashboard/pending-grooming",
        },
        {
          label: "Import Incident",
          path: "/dashboard/import-incident",
        },
        {
          label: "Unassigned Incident",
          path: "/dashboard/unassigned-incident",
        },
      ],
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <FaShieldAlt className="logo-icon" />
          <span className="logo-text">
            QA<span className="logo-dash">-</span>Manager
          </span>
        </div>
        <div className="user-badge">
          {user.user_type.replace("_", " ")}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menu.map(
          (group) =>
            group.roles.includes(user.user_type) && (
              <div className="nav-group" key={group.title}>
                <p className="group-title">{group.title}</p>

               {group.items
  .filter(
    (item) =>
      !item.roles || item.roles.includes(user.user_type)
  )
  .map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        isActive
          ? "nav-link-item active"
          : "nav-link-item"
      }
    >
      <FaStar className="star-icon" />
      <span>{item.label}</span>
    </NavLink>
))}

              </div>
            )
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
