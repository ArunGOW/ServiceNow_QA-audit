 // src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./Sidebar.css";
import logo from "../../assets/download.png"; // Company logo

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo Section */}
      {/* <div className="logo">
        <img src={logo} alt="eServeCloudSolutions Logo" className="logo-img" />
      </div> */}

      {/* Navigation Links */}
      <nav>
        <NavLink to="/dashboard/pending-qa" activeClassName="active">
          <FaStar /> My Pending QA
        </NavLink>

        <NavLink to="/dashboard/processed-qa" activeClassName="active">
          <FaStar /> Processed QA
        </NavLink>

        <NavLink to="/dashboard/pending-grooming" activeClassName="active">
          <FaStar /> Pending Grooming
        </NavLink>

        <NavLink to="/dashboard/import-incident" activeClassName="active">
          <FaStar /> Import Incident
        </NavLink>

        <NavLink to="/dashboard/unassigned-incident" activeClassName="active">
          <FaStar /> Unassigned Incident
        </NavLink>

        <NavLink to="/dashboard/user-dashboard" activeClassName="active">
          <FaStar /> User Dashboard
        </NavLink>
        <NavLink to="/dashboard/alluser-dashboard" activeClassName="active">
          <FaStar /> AlluserDashboard
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
