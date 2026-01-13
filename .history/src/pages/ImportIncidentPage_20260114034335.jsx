 
 

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
import { Form, Button, Card, Table, ProgressBar, Toast, ToastContainer } from "react-bootstrap";
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || droppedFile.type === "text/csv")) {
      setFile(droppedFile);
    }
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
        onUploadProgress: (event) => {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setProgress(percentCompleted);
        },
      });

      setResponse(res.data);
      setUploaded(true);
      setShowToast(true);
      setFile(null);
    } catch (error) {
      setResponse({
        message: "❌ Failed to import incidents.",
        error: error.response?.data || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-container p-4">
      <Card className="border-0 shadow-lg import-card mx-auto">
        {/* Header Section */}
        <div className="card-header-premium p-4 text-center">
          <div className="icon-badge mb-3">
            <i className="bi bi-file-earmark-arrow-up"></i>
          </div>
          <h3 className="fw-bold m-0">Import Incidents</h3>
          <p className="text-muted mt-2">Upload your Excel or CSV data to the central database</p>
          
          <button className="reset-circle-btn shadow-sm" onClick={resetForm} title="Reset">
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>

        <Card.Body className="p-4">
          <Form onSubmit={handleImport}>
            {/* Premium Drag & Drop Zone */}
            <div 
              className={`upload-zone mb-4 ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''} ${uploaded ? 'disabled' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !uploaded && fileInputRef.current.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => setFile(e.target.files[0])} 
                accept=".csv, .xlsx" 
                hidden 
              />
              
              {!file ? (
                <div className="upload-content">
                  <div className="cloud-icon mb-2">☁️</div>
                  <p className="mb-1 fw-bold">Click or drag file to upload</p>
                  <p className="text-muted small">Supports .xlsx and .csv</p>
                </div>
              ) : (
                <div className="file-info-zone animate__animated animate__fadeIn">
                  <div className="file-icon">📄</div>
                  <div className="text-start">
                    <p className="mb-0 fw-bold file-name-text">{file.name}</p>
                    <p className="mb-0 text-muted small">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  {!uploaded && (
                    <button className="remove-file-btn ms-auto" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>

            {loading && (
              <div className="progress-wrapper mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-bold text-primary">Uploading Data...</span>
                  <span className="small fw-bold">{progress}%</span>
                </div>
                <ProgressBar now={progress} variant="primary" className="custom-bar" />
              </div>
            )}

            <div className="d-grid">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className={`premium-btn ${uploaded ? 'success' : ''}`}
                disabled={!file || loading || uploaded}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span> Processing...</>
                ) : uploaded ? (
                  "✅ Import Successful"
                ) : (
                  "Start Import"
                )}
              </Button>
            </div>
          </Form>

          {/* Results Section */}
          {response && (
            <div className="mt-5 animate__animated animate__slideInUp">
              <h6 className="fw-bold mb-3 d-flex align-items-center">
                <span className="dot me-2"></span> Process Summary
              </h6>
              <div className="results-grid">
                <div className="result-item total">
                  <span className="result-label">Total</span>
                  <span className="result-value">{response.total_records || 0}</span>
                </div>
                <div className="result-item success">
                  <span className="result-label">Success</span>
                  <span className="result-value">{response.successful_imports || 0}</span>
                </div>
                <div className="result-item failed">
                  <span className="result-label">Failed</span>
                  <span className="result-value">{response.failed_imports || 0}</span>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={4000} autohide className="premium-toast">
          <Toast.Header closeButton={true} className="border-0">
            <strong className="me-auto text-success">Success</strong>
          </Toast.Header>
          <Toast.Body className="pt-0">{response?.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <style jsx>{`
        .import-container {
          background: #f4f7fa;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .import-card {
          max-width: 600px;
          border-radius: 20px !important;
          overflow: hidden;
          background: #ffffff;
        }

        .card-header-premium {
          background: #ffffff;
          position: relative;
          border-bottom: 1px solid #f0f0f0;
        }

        .icon-badge {
          width: 60px;
          height: 60px;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-size: 24px;
        }

        .reset-circle-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          border: none;
          background: #f8f9fa;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          color: #6c757d;
          transition: 0.3s;
        }
        
        .reset-circle-btn:hover {
          background: #ffebee;
          color: #d32f2f;
          transform: rotate(-180deg);
        }

        /* Upload Zone */
        .upload-zone {
          border: 2px dashed #d1d5db;
          border-radius: 15px;
          padding: 40px 20px;
          text-align: center;
          transition: 0.3s all;
          cursor: pointer;
          background: #fafafa;
        }

        .upload-zone:hover:not(.disabled) {
          border-color: #4f46e5;
          background: #f5f6ff;
        }

        .upload-zone.dragging {
          border-color: #4f46e5;
          background: #eef2ff;
          transform: scale(1.02);
        }

        .upload-zone.has-file {
          border-style: solid;
          border-color: #10b981;
          background: #f0fdf4;
          padding: 20px;
        }

        .file-info-zone {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .file-icon { font-size: 30px; }
        .file-name-text { 
           white-space: nowrap; 
           overflow: hidden; 
           text-overflow: ellipsis; 
           max-width: 300px; 
        }

        .remove-file-btn {
          background: #ffeded;
          color: #ef4444;
          border: none;
          border-radius: 8px;
          width: 30px;
          height: 30px;
          font-weight: bold;
        }

        /* Buttons & Progress */
        .premium-btn {
          background: #4f46e5 !important;
          border: none !important;
          border-radius: 12px !important;
          font-weight: 600;
          padding: 14px;
          transition: 0.3s;
        }

        .premium-btn:hover:not(:disabled) {
          background: #4338ca !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
        }

        .premium-btn.success {
          background: #10b981 !important;
        }

        .custom-bar {
          height: 8px !important;
          border-radius: 10px;
          background-color: #e5e7eb;
        }

        /* Results Grid */
        .results-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .result-item {
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .result-label { font-size: 11px; text-transform: uppercase; font-weight: 700; opacity: 0.7; }
        .result-value { font-size: 22px; font-weight: 800; }

        .total { background: #f3f4f6; color: #374151; }
        .success { background: #dcfce7; color: #166534; }
        .failed { background: #fee2e2; color: #991b1b; }

        .dot {
          height: 8px;
          width: 8px;
          background-color: #4f46e5;
          border-radius: 50%;
          display: inline-block;
        }

        .premium-toast {
          border-radius: 12px !important;
          border: none !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
      
      {/* Import Bootstrap Icons for the new UI */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" />
      {/* Import Animate.css for smooth transitions */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    </div>
  );
};

export default ImportIncidentPage;