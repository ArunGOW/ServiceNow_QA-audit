 
 

import { useState } from "react";
import { Form, Button, Card, Alert, Table, ProgressBar, Toast, ToastContainer } from "react-bootstrap";
import api from "../api/axois";
import {  useRef } from "react";


const ImportIncidentPage = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hideResetBtn, setHideResetBtn] = useState(false);

  const fileInputRef = useRef(null);


  const resetForm = () => {
     setHideResetBtn(true);
    setFile(null);
    if (fileInputRef.current) {
  fileInputRef.current.value = "";
}
    setResponse(null);
    setLoading(false);
    setProgress(0);
    setUploaded(false);
    setShowToast(false);
  };


 
 

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setResponse({ message: "⚠️ Please select a file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setProgress(0);
      setUploaded(false);

      const res = await api.post("/users/import-incidents-from-excel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            const percentCompleted = Math.round((event.loaded * 100) / event.total);
            setProgress(percentCompleted);
          },
        }
      );

      setResponse(res.data);
      setUploaded(true);
      setShowToast(true);
      setFile(null);
    } catch (error) {
      console.error("❌ Error importing incidents:", error);
      setResponse({
        message: "❌ Failed to import incidents.",
        error: error.response?.data || error.message,
      });
      setUploaded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 d-flex justify-content-center">
      <Card className="p-4 shadow-lg rounded-4 import-card" style={{ maxWidth: "700px", width: "100%", position: "relative" }}>
        {/* Reset / Close Button */}
        <Button
          variant="danger"
          size="sm"
          style={{ position: "absolute", top: "10px", right: "10px", borderRadius: "50%" }}
          onClick={resetForm}
        >
          ✕
        </Button>

        <h4 className="fw-bold mb-4 text-center" style={{ color: "#2a5298" }}>
          📂 Import Incidents
        </h4>

        {/* {response?.message && <Alert variant="info" className="shadow-sm">{response.message}</Alert>} */}

         
       

        <Form onSubmit={handleImport}>
          {/* <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className="fw-semibold">Select Excel/CSV file</Form.Label>
            <Form.Control
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="p-3 rounded border-0 shadow-sm"
              disabled={uploaded}
            />
          </Form.Group> */}
          <Form.Group controlId="formFile" className="mb-3">
  <Form.Label className="fw-semibold">Select Excel/CSV file</Form.Label>

  <div style={{ position: "relative" }}>
    {/* File Input */}
    <Form.Control
      type="file"
      accept=".csv,.xlsx"
      ref={fileInputRef}
      onChange={(e) => setFile(e.target.files[0])}
      className="p-3 rounded border-0 shadow-sm"
      disabled={uploaded}
    />

    {/* Remove Button (❌) */}
    {file && (
      <button
        type="button"
        onClick={() => {
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
        style={{
          position: "absolute",
          right: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#dc3545",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    )}
  </div>
</Form.Group>


           {progress > 0 && !uploaded && (
  <ProgressBar
    now={progress}
    label={`${progress}%`}
    animated
    striped
    variant="success"
    className="mb-3 rounded-pill shadow-sm"
  />
)}

          <div className="d-flex justify-content-center">
            <Button
              type="submit"
              variant="info"
              className="px-5 shadow-sm text-white fw-bold"
              disabled={loading || uploaded}
            >
              {uploaded ? " Imported" : loading ? "Importing..." : "Import"}
            </Button>
          </div>
        </Form>

        {response && (
          <Table striped bordered hover responsive className="mt-4 text-center shadow-sm rounded">
            <thead className="table-primary">
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

      {/* Toast Notification */}
      {/* <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Import Status</strong>
          </Toast.Header>
          <Toast.Body className="text-white">✅ File uploaded successfully!</Toast.Body>
        </Toast>
      </ToastContainer> */}
         <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Import Status</strong>
          </Toast.Header>
         <Toast.Body className="text-white">
  {response?.message && response.message}
</Toast.Body>

        </Toast>
      </ToastContainer>

      <style jsx>{`
        .import-card {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          transition: transform 0.2s;
        }
        .import-card:hover {
          transform: translateY(-5px);
        }
        .btn-info {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          border: none;
           
        }
        .btn-info:hover {
          background: linear-gradient(135deg, #2a5298, #1e3c72);
        }
      `}</style>
    </div>
  );
};

export default ImportIncidentPage;
