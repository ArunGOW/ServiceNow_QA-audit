//  // src/components/layout/Sidebar.jsx
// import { Nav } from "react-bootstrap";
// import { FaStar } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";

// const Sidebar = () => {
//   const location = useLocation();

//   const menuItems = [
//     { path: "/pending-qa", label: "Pending QA" },
//     { path: "/processed-qa", label: "Processed QA" },
//     { path: "/pending-grooming", label: "Pending Grooming" },
//     { path: "/import-incident", label: "Import Incident" },
//     { path: "/export-incident", label: "Export Incident" },
//   ];

//   return (
//     <div>
//       <h2 className="p-3 fw-bold border-bottom">Logo</h2>
//       <Nav className="flex-column">
//         {menuItems.map((item) => (
//           <Nav.Item key={item.path}>
//             <Link
//               to={item.path}
//               className={`d-flex align-items-center px-3 py-2 text-decoration-none ${
//                 location.pathname === item.path
//                   ? "bg-light text-dark rounded"
//                   : "text-white"
//               }`}
//             >
//               <FaStar className="me-2" />
//               {item.label}
//             </Link>
//           </Nav.Item>
//         ))}
//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;


// src/components/layout/Sidebar.jsx
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-light p-3 border-end" style={{ minHeight: "100vh", width: "220px" }}>
      <h5 className="fw-bold mb-4">Menu</h5>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/dashboard/pending-qa">
          Pending QA
        </Nav.Link>
        <Nav.Link as={Link} to="/dashboard/processed-qa">
          Processed QA
        </Nav.Link>
        <Nav.Link as={Link} to="/dashboard/pending-grooming">
          Pending Grooming
        </Nav.Link>
        <Nav.Link as={Link} to="/dashboard/import-incident">
          Import Incident
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
