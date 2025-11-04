//  import { useState } from "react";
// import { Form, Button, Card, Alert, Table } from "react-bootstrap";
// import api from "../api/axois";

// const ImportIncidentPage = () => {
//   const [file, setFile] = useState(null);
//   const [response, setResponse] = useState(null); // store full response

//   const handleImport = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setResponse({ message: "⚠️ Please select a file first." });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await api.post(
//         "http://localhost:8000/api/users/import-incidents-from-excel?user_sid=a17692bf-2164-4929-90f2-8b25f65c9445",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       console.log("✅ Import Response:", res.data);
//       setResponse(res.data);
//     } catch (error) {
//       console.error("❌ Error importing incidents:", error);
//       setResponse({
//         message: "❌ Failed to import incidents.",
//         error: error.response?.data || error.message,
//       });
//     }
//   };

//   return (
//     <div className="p-3">
//       <Card className="p-4 shadow-sm">
//         <h5 className="fw-bold mb-3">📂 Import Incidents</h5>

//         {response?.message && <Alert variant="info">{response.message}</Alert>}

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

//         {response && (
//           <Table striped bordered hover responsive className="mt-3 text-center">
//             <thead className="table-light">
//               <tr>
//                 <th>Total Records</th>
//                 <th>Successful Imports</th>
//                 <th>Failed Imports</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>{response.total_records || 0}</td>
//                 <td>{response.successful_imports || 0}</td>
//                 <td>{response.failed_imports || 0}</td>
//               </tr>
//             </tbody>
//           </Table>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default ImportIncidentPage;

import React, { useState, useContext } from "react";
import { Modal, Button, Form, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axois";

const ImportExcelModal = ({ show, handleClose }) => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(null);
    setProgress(0);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage({ type: "danger", text: "Please select a file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await api.post(
        `http://127.0.0.1:8000/api/users/import-incidents-from-excel?user_sid=${user?.user_sid}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );
      setMessage({ type: "success", text: "Excel imported successfully!" });
      setFile(null);
      setProgress(100);
      console.log("Import response:", res.data);
    } catch (err) {
      console.error("Import error:", err);
      setMessage({ type: "danger", text: "Failed to import Excel file." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      dialogClassName="custom-modal"
    >
      <Modal.Header className="custom-modal-header" closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <span role="img" aria-label="excel" className="fs-4">📂</span>
          <span className="fw-bold">Import Incidents</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="custom-modal-body">
        {message && <Alert variant={message.type} className="shadow-sm">{message.text}</Alert>}

        <Form>
          <Form.Group controlId="formFile" className="mb-4">
            <Form.Label className="fw-bold">Upload Excel File</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="p-3 rounded border-0 shadow-sm"
            />
          </Form.Group>
        </Form>

        {progress > 0 && (
          <ProgressBar
            now={progress}
            label={`${progress}%`}
            animated
            striped
            variant="info"
            className="mb-3 rounded-pill shadow-sm"
          />
        )}

        <p className="text-muted small">
          Ensure your file follows the standard column format for smooth import.
        </p>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button
          variant="outline-light"
          onClick={handleClose}
          className="fw-semibold btn-shadow"
        >
          Cancel
        </Button>
        <Button
          variant="info"
          onClick={handleImport}
          disabled={loading}
          className="fw-semibold btn-shadow px-4"
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Import"}
        </Button>
      </Modal.Footer>

      <style jsx>{`
        .custom-modal {
          border-radius: 15px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
        }

        .custom-modal-header {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: #fff;
          border-bottom: none;
          padding: 1rem 1.5rem;
        }

        .custom-modal-body {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 0 0 15px 15px;
          animation: fadeIn 0.3s ease-in-out;
        }

        .btn-shadow {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease-in-out;
        }

        .btn-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Modal>
  );
};

export default ImportExcelModal;
