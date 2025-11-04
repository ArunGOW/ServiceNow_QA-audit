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
 

import { useState } from "react";
import { Form, Button, Card, Alert, Table, ProgressBar } from "react-bootstrap";
import api from "../api/axois";

const ImportIncidentPage = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false); // Track if upload is done

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

      const res = await api.post(
        "http://localhost:8000/api/users/import-incidents-from-excel?user_sid=a17692bf-2164-4929-90f2-8b25f65c9445",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            const percentCompleted = Math.round((event.loaded * 100) / event.total);
            setProgress(percentCompleted);
          },
        }
      );

      console.log("✅ Import Response:", res.data);
      setResponse(res.data);
      setUploaded(true); // mark upload as done
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
      <Card className="p-4 shadow-lg rounded-4 import-card" style={{ maxWidth: "700px", width: "100%" }}>
        <h4 className="fw-bold mb-4 text-center" style={{ color: "#2a5298" }}>
          📂 Import Incidents
        </h4>

        {response?.message && <Alert variant="info" className="shadow-sm">{response.message}</Alert>}

        <Form onSubmit={handleImport}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className="fw-semibold">Select Excel/CSV file</Form.Label>
            <Form.Control
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="p-3 rounded border-0 shadow-sm"
              disabled={uploaded} // disable after upload if needed
            />
          </Form.Group>

          {progress > 0 && (
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
              className="px-5 shadow-sm"
              disabled={loading || uploaded} // disable if uploading or done
            >
              {uploaded ? "Uploaded" : loading ? "Uploading..." : "Upload"}
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
