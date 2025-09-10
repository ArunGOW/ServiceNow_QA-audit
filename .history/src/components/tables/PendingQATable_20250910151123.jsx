// //  // src/components/tables/PendingQATable.jsx
// // import { Table, Spinner, Badge } from "react-bootstrap";

// //  const PendingQATable = ({ incidents, loading }) => {

// //   console.log("🟢 Pending Incidents passed to table:", incidents);

// //   if (loading) return <p>Loading...</p>;

// //   if (!incidents || incidents.length === 0) {
// //     return <p>No pending incidents found.</p>;
// //   }
// //   useEffect(() => {
// //   const fetchData = async () => {
// //     if (!user?.user_sid) {
// //       console.warn("⚠️ No user_sid found, skipping fetch.");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const skip = (currentPage - 1) * limit;

// //       const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
// //         user_sid: user.user_sid,
// //         skip,
// //         limit,
// //       });

// //       console.log("📌 Full API Response:", res.data);

// //       const allIncidents = res.data?.incidents || [];
// //       console.log("allIncidents data",allIncidents)

// //       // 🔎 Log audit_status of each incident
// //       console.log("🔍 audit_status values from API:", allIncidents.map(i => i.audit_status));

// //       setPendingIncidents(
// //         allIncidents.filter((i) => i.audit_status?.toLowerCase() === "pending")
// //       );
// //       setProcessedIncidents(
// //         allIncidents.filter((i) => i.audit_status?.toLowerCase() === "completed")
// //       );

// //       if (res.data?.totalCount) {
// //         setTotalPages(Math.ceil(res.data.totalCount / limit));
// //       }
// //     } catch (error) {
// //       console.error("❌ Error fetching incidents:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   fetchData();
// // }, [currentPage, user]);


// //   return (
// //      <Table>
// //   <thead>
// //     <tr>
// //       <th>Incident #</th>
// //       <th>Handled By</th>
// //       <th>Handled On</th>
// //       <th>Current Status</th>
// //     </tr>
// //   </thead>
// //   <tbody>

// //     {console.log("pendingIncidents",incidents)}
// //     {incidents.length > 0 ? (
// //       incidents.map((incident, index) => (
// //         <tr key={incident.id || index}>
// //           <td>{incident.incident_number || "N/A"}</td>
// //           <td>{incident.handled_by || "N/A"}</td>
// //           <td>{incident.handled_on ? new Date(incident.handled_on).toLocaleDateString() : "N/A"}</td>
// //           <td>{incident.audit_status || "N/A"}</td>
// //         </tr>
// //       ))
// //     ) : (
// //       <tr>
// //         <td colSpan="4" style={{ textAlign: "center" }}>
// //           No Pending Incidents Found
// //         </td>
// //       </tr>
// //     )}
// //   </tbody>
// // </Table>

// //   );
// // };


// // export default PendingQATable;

// import React, { useEffect, useState } from "react";

// const PendingQATable = ({ incidents, loading }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     setData(incidents);
//   }, [incidents]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <table border="1" width="100%">
//       <thead>
//         <tr>
//           <th>Incident No</th>
//           <th>Handled By</th>
//           <th>Handled On</th>
//           <th>Current Status</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((incident, idx) => (
//           <tr key={idx}>
//             <td>{incident. incident_number
// }</td>
//             <td>{incident.assigned_analyst
// }</td>
// <td>{incident.incident_date
// }</td>
//             <td>{incident.audit_status}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default PendingQATable;


 // src/components/tables/ProcessedQATable.jsx
import { Table, Spinner } from "react-bootstrap";

const PendingQATable = ({ incidents, loading }) => {
  return (
    <div className="bg-white rounded shadow-sm p-3">
      <h5 className="fw-bold mb-3">Processed QA</h5>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Incident #</th>
              <th>Handled By</th>
              <th>Handled On</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <tr key={index}>
                  <td>{incident.incident_number || "N/A"}</td>
                  <td>{incident.assigned_analyst || "N/A"}</td>
                  <td>{incident.incident_date || "N/A"}</td>
                  <td>{incident.resolution_status || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No processed QA records found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PendingQATable;

