 import { useState } from "react";
import { Form, Button, Card, Alert, Table } from "react-bootstrap";
import api from "../api/axois";

const ImportIncidentPage = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null); // store full response

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setResponse({ message: "⚠️ Please select a file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(
        "http://localhost:8000/api/users/import-incidents-from-excel?user_sid=a17692bf-2164-4929-90f2-8b25f65c9445",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Import Response:", res.data);
      setResponse(res.data);
    } catch (error) {
      console.error("❌ Error importing incidents:", error);
      setResponse({
        message: "❌ Failed to import incidents.",
        error: error.response?.data || error.message,
      });
    }
  };

  return (
    <div className="p-3">
      <Card className="p-4 shadow-sm">
        <h5 className="fw-bold mb-3">📂 Import Incidents</h5>

        {response?.message && <Alert variant="info">{response.message}</Alert>}

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

        {response && (
          <Table striped bordered hover responsive className="mt-3 text-center">
            <thead className="table-light">
              <tr>
                <th>Total Records</th>
                <th>Successful Imports</th>
                <th>Failed Imports</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{response.total_records || 0}</td>
                <td>{response.successful_imports || 0}</td>
                <td>{response.failed_imports || 0}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default ImportIncidentPage;
