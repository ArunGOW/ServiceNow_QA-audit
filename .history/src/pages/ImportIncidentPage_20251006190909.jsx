// src/pages/ImportIncidentPage.jsx
import { useState } from "react";
import { Form, Button, Card, Alert, Table } from "react-bootstrap";
import api from "../api/axois";

const ImportIncidentPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [responseDetails, setResponseDetails] = useState([]); // store backend response

 const handleImport = async (e) => {
  e.preventDefault();
  if (!file) {
    setMessage("⚠️ Please select a file first.");
    setResponseDetails([]);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post(
      "http://localhost:8000/api/users/import-incidents-from-excel?user_sid=a17692bf-2164-4929-90f2-8b25f65c9445",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("✅ Import Response:", res.data); // <-- log full response

    setMessage("✅ Incidents imported successfully!");

    if (res.data?.details) {
      console.log("📌 Details:", res.data.details); // <-- log details specifically
      setResponseDetails(res.data.details);
    } else {
      console.warn("⚠️ No 'details' key found in response");
      setResponseDetails([]);
    }
  } catch (error) {
    console.error("❌ Error importing incidents:", error);
    setMessage("❌ Failed to import incidents.");

    if (error.response?.data?.details) {
      console.log("📌 Error Details:", error.response.data.details);
      setResponseDetails(error.response.data.details);
    } else {
      setResponseDetails([]);
    }
  }
};


  return (
    <div className="p-3">
      <Card className="p-4 shadow-sm">
        <h5 className="fw-bold mb-3">📂 Import Incidents</h5>
        {message && <Alert variant={message.startsWith("✅") ? "success" : "danger"}>{message}</Alert>}
        <Form onSubmit={handleImport}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select Excel/CSV file</Form.Label>
            <Form.Control
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Upload
          </Button>
        </Form>

        {/* Show detailed response */}
        {responseDetails.length > 0 && (
          <div className="mt-4">
            <h6 className="fw-bold">Import Details</h6>
            <Table bordered hover responsive size="sm">
              <thead>
                <tr>
                  {Object.keys(responseDetails[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responseDetails.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i}>{val?.toString()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImportIncidentPage;

