// // src/pages/ImportIncidentPage.jsx
// import { useState } from "react";
// import axios from "axios";
// import { Form, Button, Card, Alert } from "react-bootstrap";

// const ImportIncidentPage = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");

//   const handleImport = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMessage("⚠️ Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await axios.post("http://localhost:8000/api/users/import/incidents", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setMessage("✅ Incidents imported successfully!");
//     } catch (error) {
//       console.error("Error importing incidents:", error);
//       setMessage("❌ Failed to import incidents.");
//     }
//   };

//   return (
//     <div className="p-3">
//       <Card className="p-4 shadow-sm">
//         <h5 className="fw-bold mb-3">📂 Import Incidents</h5>
//         {message && <Alert variant="info">{message}</Alert>}
//         <Form onSubmit={handleImport}>
//           <Form.Group controlId="formFile" className="mb-3">
//             <Form.Label>Select Excel/CSV file</Form.Label>
//             <Form.Control
//               type="file"
//               accept=".csv,.xlsx"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//           </Form.Group>
//           <Button type="submit" variant="primary">
//             Upload
//           </Button>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default ImportIncidentPage;

import React, { useState, useContext } from "react";
import { Button, Form, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ImportIncidents = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage({ type: "danger", text: "⚠️ Please select a file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `http://127.0.0.1:8000/api/users/import-incidents-from-excel?user_sid=${user?.user_sid}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage({ type: "success", text: "✅ Excel imported successfully!" });
      console.log("📌 Import response:", res.data);
    } catch (err) {
      console.error("❌ Import error:", err);
      setMessage({ type: "danger", text: "Failed to import Excel file." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="p-4 border rounded bg-light shadow-sm">
      <Row className="mb-3">
        <Col>
          <h5 className="fw-bold">📂 Import Incidents from Excel</h5>
        </Col>
      </Row>

      {message && (
        <Row className="mb-3">
          <Col>
            <Alert variant={message.type}>{message.text}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={8}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className="fw-bold">Upload Excel File</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col className="text-muted small">
          Make sure your file follows the standard column format.
        </Col>
      </Row>

      <Row>
        <Col>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={loading}
            className="px-4"
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Import"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ImportIncidents;

