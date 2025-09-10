import React, { useState, useContext } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ImportExcelModal = ({ show, handleClose }) => {
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
      handleClose(); // close modal after success
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to import Excel. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Import Incidents from Excel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Select Excel File</Form.Label>
          <Form.Control
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Import Excel"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportExcelModal;
