// src/pages/GroomingPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spinner } from "react-bootstrap";

const GroomingPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8000/api/users/get/incidents", {
          skip: 0,
          limit: 20,
        });
        setIncidents(res.data.grooming || []);
      } catch (error) {
        console.error("Error fetching grooming incidents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Pending Grooming</h5>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Incident #</th>
              <th>Analyst</th>
              <th>Incident Date</th>
              <th>Grooming Needed</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => (
              <tr key={index}>
                <td>{incident.incident_number || "N/A"}</td>
                <td>{incident.assigned_analyst || "N/A"}</td>
                <td>{incident.incident_date || "N/A"}</td>
                <td>{incident.grooming_needed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default GroomingPage;
