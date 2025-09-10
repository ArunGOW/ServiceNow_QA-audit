 import React, { useState, useContext } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ImportExcel = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      alert("Please select an Excel file first!");
      return;
    }

    if (!user?.user_sid) {
      alert("User SID is missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `http://127.0.0.1:8000/api/users/import-incidents-from-excel?user_sid=${user.user_sid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Excel imported successfully!");
      console.log("Import response:", res.data);
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to import Excel. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h3>Import Incidents from Excel</h3>
        <Form.Group className="mt-3">
          <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </Form.Group>

        <Button
          className="mt-3"
          variant="primary"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? "Importing..." : "Import Excel"}
        </Button>
      </Card>
    </Container>
  );
};

export default ImportExcel;
