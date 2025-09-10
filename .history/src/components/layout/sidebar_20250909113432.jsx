 // src/components/layout/Sidebar.jsx
import { Nav } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/pending-qa", label: "Pending QA" },
    { path: "/processed-qa", label: "Processed QA" },
    { path: "/pending-grooming", label: "Pending Grooming" },
    { path: "/import-incident", label: "Import Incident" },
    { path: "/export-incident", label: "Export Incident" },
  ];

  return (
    <div>
      <h2 className="p-3 fw-bold border-bottom">Logo</h2>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Item key={item.path}>
            <Link
              to={item.path}
              className={`d-flex align-items-center px-3 py-2 text-decoration-none ${
                location.pathname === item.path
                  ? "bg-light text-dark rounded"
                  : "text-white"
              }`}
            >
              <FaStar className="me-2" />
              {item.label}
            </Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
