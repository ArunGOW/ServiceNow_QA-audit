// src/pages/ImportIncidentPage.jsx
import { useState } from "react";
import axios from "axios";
import { Button, Form, Card, Spinner } from "react-bootstrap";

const ImportIncidentPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/users/import-incidents-from-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Incidents imported successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("❌ Failed to import incidents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h5 className="fw-bold mb-3">📂 Import Incidents</h5>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Control
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Form.Group>
      <Button onClick={handleUpload} variant="primary" disabled={loading}>
        {loading ? <Spinner size="sm" animation="border" /> : "Upload Excel"}
      </Button>
    </Card>
  );
};

export default ImportIncidentPage;
