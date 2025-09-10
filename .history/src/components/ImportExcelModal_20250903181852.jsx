//  import React, { useState } from "react";
// import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
// import axios from "axios";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// const ImportExcelModal = ({ show, handleClose }) => {
//   const { user } = useContext(AuthContext);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleImport = async () => {
//     if (!file) {
//       setMessage({ type: "danger", text: "Please select a file first." });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         `http://127.0.0.1:8000/api/users/import-incidents-from-excel?user_sid=${user?.user_sid}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       setMessage({ type: "success", text: "Excel imported successfully!" });
//       console.log("Import response:", res.data);
//     } catch (err) {
//       console.error("Import error:", err);
//       setMessage({ type: "danger", text: "Failed to import Excel file." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered backdrop="static">
//       <Modal.Header closeButton className="bg-dark text-white">
//         <Modal.Title>📂 Import Incidents from Excel</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {message && (
//           <Alert variant={message.type} className="mb-3">
//             {message.text}
//           </Alert>
//         )}
//         <Form>
//           <Form.Group controlId="formFile" className="mb-3">
//             <Form.Label className="fw-bold">Upload Excel File</Form.Label>
//             <Form.Control
//               type="file"
//               accept=".xlsx, .xls"
//               onChange={handleFileChange}
//               className="p-2 border border-2 rounded"
//             />
//           </Form.Group>
//         </Form>
//         <div className="text-muted small">
//           Make sure your file follows the standard column format.
//         </div>
//       </Modal.Body>
//       <Modal.Footer className="d-flex justify-content-between">
//         <Button variant="secondary" onClick={handleClose}>
//           Cancel
//         </Button>
//         <Button
//           variant="primary"
//           onClick={handleImport}
//           disabled={loading}
//           className="px-4"
//         >
//           {loading ? <Spinner animation="border" size="sm" /> : "Import"}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ImportExcelModal;


// ImportExcelModal.jsx
import React, { useState, useContext } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// const ImportExcelModal = ({ show, handleClose, onSuccess }) => {
//   const { user } = useContext(AuthContext);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await axios.post(
//         `http://127.0.0.1:8000/api/users/import-incidents-from-excel?user_sid=${user?.user_sid}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       console.log("Excel Upload Response:", res.data);

//       // ✅ trigger Dashboard to refresh incidents
//       if (onSuccess) onSuccess();

//       handleClose();
//     } catch (err) {
//       console.error("Error uploading file:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>📂 Import Excel</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group>
//           <Form.Label>Select Excel File</Form.Label>
//           <Form.Control type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
//         </Form.Group>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>Close</Button>
//         <Button
//           variant="primary"
//           onClick={handleUpload}
//           disabled={!file || loading}
//         >
//           {loading ? <Spinner size="sm" animation="border" /> : "Upload"}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

const ImportExcelModal = ({ show, handleClose, onUploadSuccess }) => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
       await axios.post(
  `http://127.0.0.1:8000/api/users/import-incidents-from-excel?user_sid=${user?.user_sid}`,
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);


      alert("Excel uploaded successfully!");
      handleClose();
      if (onUploadSuccess) onUploadSuccess(); // 🔑 Refresh incidents
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload Excel");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>📂 Import Incidents from Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="file"
          className="form-control"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleUpload}>Upload</Button>
      </Modal.Footer>
    </Modal>
  );
};


export default ImportExcelModal;
