// src/pages/ImportIncidentPage.jsx
import { useState } from "react";
import axios from "axios";
import { Form, Button, Card, Alert } from "react-bootstrap";

const ImportIncidentPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

//   const handleImport = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMessage("⚠️ Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await axios.post("http://localhost:8000/api/users/import-incidents-from-excel?user_sid=a17692bf-2164-4929-90f2-8b25f65c9445", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setMessage("✅ Incidents imported successfully!");
//     } catch (error) {
//       console.error("Error importing incidents:", error);
//       setMessage("❌ Failed to import incidents.");
//     }
//   };

 const handleImport = async () => {
    if (!file) {
      setMessage({ type: "danger", text: "Please select a file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `http://127.0.0.1:8000/api/users/import-incidents-from-excel?user_sid=${user?.user_sid}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage({ type: "success", text: "Excel imported successfully!" });
      console.log("Import response:", res.data);
    } catch (err) {
      console.error("Import error:", err);
      setMessage({ type: "danger", text: "Failed to import Excel file." });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-3">
      <Card className="p-4 shadow-sm">
        <h5 className="fw-bold mb-3">📂 Import Incidents</h5>
        {message && <Alert variant="info">{message}</Alert>}
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
      </Card>
    </div>
  );
};

export default ImportIncidentPage;
