 
 

// import { useState } from "react";
// import { Form, Button, Card, Alert, Table, ProgressBar, Toast, ToastContainer } from "react-bootstrap";
// import api from "../api/axois";
// import {  useRef } from "react";


// const ImportIncidentPage = () => {
//   const [file, setFile] = useState(null);
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [uploaded, setUploaded] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [hideResetBtn, setHideResetBtn] = useState(false);

//   const fileInputRef = useRef(null);


//   const resetForm = () => {
//      setHideResetBtn(true);
//     setFile(null);
//     if (fileInputRef.current) {
//   fileInputRef.current.value = "";
// }
//     setResponse(null);
//     setLoading(false);
//     setProgress(0);
//     setUploaded(false);
//     setShowToast(false);
//   };


 
 

//   const handleImport = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setResponse({ message: "⚠️ Please select a file first." });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);
//       setProgress(0);
//       setUploaded(false);

//       const res = await api.post("/users/import-incidents-from-excel",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           onUploadProgress: (event) => {
//             const percentCompleted = Math.round((event.loaded * 100) / event.total);
//             setProgress(percentCompleted);
//           },
//         }
//       );

//       setResponse(res.data);
//       setUploaded(true);
//       setShowToast(true);
//       setFile(null);
//     } catch (error) {
//       console.error("❌ Error importing incidents:", error);
//       setResponse({
//         message: "❌ Failed to import incidents.",
//         error: error.response?.data || error.message,
//       });
//       setUploaded(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 d-flex justify-content-center">
//       <Card className="p-4 shadow-lg rounded-4 import-card" style={{ maxWidth: "700px", width: "100%", position: "relative" }}>
//         {/* Reset / Close Button */}
//         <Button
//           variant="danger"
//           size="sm"
//           style={{ position: "absolute", top: "10px", right: "10px", borderRadius: "50%" }}
//           onClick={resetForm}
//         >
//           ✕
//         </Button>

//         <h4 className="fw-bold mb-4 text-center" style={{ color: "#2a5298" }}>
//           📂 Import Incidents
//         </h4>

//         {/* {response?.message && <Alert variant="info" className="shadow-sm">{response.message}</Alert>} */}

         
       

//         <Form onSubmit={handleImport}>
//           {/* <Form.Group controlId="formFile" className="mb-3">
//             <Form.Label className="fw-semibold">Select Excel/CSV file</Form.Label>
//             <Form.Control
//               type="file"
//               accept=".csv,.xlsx"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="p-3 rounded border-0 shadow-sm"
//               disabled={uploaded}
//             />
//           </Form.Group> */}
//           <Form.Group controlId="formFile" className="mb-3">
//   <Form.Label className="fw-semibold">Select Excel/CSV file</Form.Label>

//   <div style={{ position: "relative" }}>
//     {/* File Input */}
//     <Form.Control
//       type="file"
//       accept=".csv,.xlsx"
//       ref={fileInputRef}
//       onChange={(e) => setFile(e.target.files[0])}
//       className="p-3 rounded border-0 shadow-sm"
//       disabled={uploaded}
//     />

//     {/* Remove Button (❌) */}
//     {file && (
//       <button
//         type="button"
//         onClick={() => {
//           setFile(null);
//           if (fileInputRef.current) fileInputRef.current.value = "";
//         }}
//         style={{
//           position: "absolute",
//           right: "15px",
//           top: "50%",
//           transform: "translateY(-50%)",
//           background: "transparent",
//           border: "none",
//           fontSize: "18px",
//           cursor: "pointer",
//           color: "#dc3545",
//           fontWeight: "bold",
//         }}
//       >
//         ✕
//       </button>
//     )}
//   </div>
// </Form.Group>


//            {progress > 0 && !uploaded && (
//   <ProgressBar
//     now={progress}
//     label={`${progress}%`}
//     animated
//     striped
//     variant="success"
//     className="mb-3 rounded-pill shadow-sm"
//   />
// )}

//           <div className="d-flex justify-content-center">
//             <Button
//               type="submit"
//               variant="info"
//               className="px-5 shadow-sm text-white fw-bold"
//               disabled={loading || uploaded}
//             >
//               {uploaded ? " Imported" : loading ? "Importing..." : "Import"}
//             </Button>
//           </div>
//         </Form>

//         {response && (
//           <Table striped bordered hover responsive className="mt-4 text-center shadow-sm rounded">
//             <thead className="table-primary">
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

//       {/* Toast Notification */}
//       {/* <ToastContainer position="top-end" className="p-3">
//         <Toast
//           onClose={() => setShowToast(false)}
//           show={showToast}
//           delay={3000}
//           autohide
//           bg="success"
//         >
//           <Toast.Header>
//             <strong className="me-auto">Import Status</strong>
//           </Toast.Header>
//           <Toast.Body className="text-white">✅ File uploaded successfully!</Toast.Body>
//         </Toast>
//       </ToastContainer> */}
//          <ToastContainer position="top-end" className="p-3">
//         <Toast
//           onClose={() => setShowToast(false)}
//           show={showToast}
//           delay={3000}
//           autohide
//           bg="success"
//         >
//           <Toast.Header>
//             <strong className="me-auto">Import Status</strong>
//           </Toast.Header>
//          <Toast.Body className="text-white">
//   {response?.message && response.message}
// </Toast.Body>

//         </Toast>
//       </ToastContainer>

//       <style jsx>{`
//         .import-card {
//           background: linear-gradient(135deg, #f8f9fa, #e9ecef);
//           transition: transform 0.2s;
//         }
//         .import-card:hover {
//           transform: translateY(-5px);
//         }
//         .btn-info {
//           background: linear-gradient(135deg, #1e3c72, #2a5298);
//           border: none;
           
//         }
//         .btn-info:hover {
//           background: linear-gradient(135deg, #2a5298, #1e3c72);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ImportIncidentPage;

import { useState, useRef } from "react";
import { Form, Button, Card, ProgressBar, Toast, ToastContainer } from "react-bootstrap";
import api from "../api/axois";

const ImportIncidentPage = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setResponse(null);
    setLoading(false);
    setProgress(0);
    setUploaded(false);
    setShowToast(false);
  };

  const handleImport = async (e) => {
    if (e) e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      setProgress(0);
      const res = await api.post("/users/import-incidents-from-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => setProgress(Math.round((event.loaded * 100) / event.total)),
      });
      setResponse(res.data);
      setUploaded(true);
      setShowToast(true);
      setFile(null);
    } catch (error) {
      setResponse({ message: "❌ Failed to import incidents." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-wrapper">
      <Card className="import-compact-card shadow-lg border-0">
        {/* Slim Header */}
        <div className="compact-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="mini-icon me-2"><i className="bi bi-cloud-arrow-up-fill"></i></div>
            <h6 className="fw-bold m-0 text-dark">Import Data</h6>
          </div>
          <button className="btn-close-sm" onClick={resetForm}>✕</button>
        </div>

        <Card.Body className="px-4 py-3">
          <Form onSubmit={handleImport}>
            {/* Slim Upload Zone */}
            <div 
              className={`slim-upload-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''} ${uploaded ? 'disabled' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); setFile(e.dataTransfer.files[0]); }}
              onClick={() => !uploaded && fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} accept=".csv, .xlsx" hidden />
              
              {!file ? (
                <div className="upload-prompt">
                  <i className="bi bi-file-earmark-spreadsheet fs-4 text-primary"></i>
                  <span className="ms-2 fw-medium small">Click to upload Excel/CSV</span>
                </div>
              ) : (
                <div className="file-active-info d-flex align-items-center w-100">
                  <i className="bi bi-file-check-fill text-success fs-5"></i>
                  <div className="ms-2 flex-grow-1 text-truncate small fw-bold text-dark">{file.name}</div>
                  {!uploaded && <button className="remove-btn-mini" onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>}
                </div>
              )}
            </div>

            {loading && <ProgressBar now={progress} className="slim-progress mb-3" animated />}

            <div className="d-grid">
              <Button type="submit" className={`premium-slim-btn ${uploaded ? 'success' : ''}`} disabled={!file || loading || uploaded}>
                {loading ? 'Processing...' : uploaded ? 'Import Complete' : 'Start Import'}
              </Button>
            </div>
          </Form>

          {/* Compact Results Bar */}
          {response && (
            <div className="results-strip animate__animated animate__fadeInUp">
              <div className="strip-item">
                <label>TOTAL</label>
                <strong>{response.total_records || 0}</strong>
              </div>
              <div className="strip-item success">
                <label>SUCCESS</label>
                <strong>{response.successful_imports || 0}</strong>
              </div>
              <div className="strip-item failed">
                <label>FAILED</label>
                <strong>{response.failed_imports || 0}</strong>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <ToastContainer position="top-right" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="dark" className="text-white border-0 shadow-lg">
          <Toast.Body className="small">✅ {response?.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <style jsx>{`
        .import-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: calc(100vh - 100px); /* Centers in screen minus nav space */
        }
        .import-compact-card {
          width: 100%;
          max-width: 480px;
          border-radius: 12px;
          overflow: hidden;
        }
        .compact-header {
          padding: 12px 20px;
          background: #f8fafc;
          border-bottom: 1px solid #edf2f7;
        }
        .mini-icon {
          background: #3182ce;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .btn-close-sm {
          border: none;
          background: transparent;
          color: #a0aec0;
          font-size: 18px;
        }
        .slim-upload-zone {
          border: 2px dashed #cbd5e0;
          border-radius: 10px;
          padding: 18px;
          text-align: center;
          cursor: pointer;
          transition: 0.2s;
          background: #fdfdfd;
          margin-bottom: 15px;
        }
        .slim-upload-zone.has-file {
          border: 1px solid #68d391;
          background: #f0fff4;
        }
        .remove-btn-mini {
          background: #fed7d7;
          border: none;
          color: #c53030;
          border-radius: 4px;
          width: 22px;
          height: 22px;
          font-size: 12px;
        }
        .premium-slim-btn {
          background: #3182ce;
          border: none;
          border-radius: 8px;
          padding: 10px;
          font-weight: 700;
          font-size: 14px;
        }
        .premium-slim-btn.success { background: #38a169 !important; }
        .slim-progress { height: 6px; border-radius: 10px; }

        /* Compact Results Strip */
        .results-strip {
          display: flex;
          margin-top: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #edf2f7;
        }
        .strip-item {
          flex: 1;
          text-align: center;
          padding: 8px;
          border-right: 1px solid #edf2f7;
        }
        .strip-item:last-child { border-right: none; }
        .strip-item label {
          display: block;
          font-size: 9px;
          font-weight: 800;
          color: #718096;
          margin-bottom: 2px;
        }
        .strip-item strong { font-size: 18px; color: #2d3748; }
        .strip-item.success strong { color: #38a169; }
        .strip-item.failed strong { color: #e53e3e; }
      `}</style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" />
    </div>
  );
};

export default ImportIncidentPage;