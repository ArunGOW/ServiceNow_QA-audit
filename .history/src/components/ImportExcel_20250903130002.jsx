 import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Container, Form, Table } from "react-bootstrap";

const ImportExcel = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;

      try {
        // Read workbook
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // Take first sheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        console.log("Imported Excel Data:", jsonData);
        setData(jsonData);
      } catch (err) {
        console.error("Error reading Excel file:", err);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Container className="mt-5">
      <h3>Import Issues from Excel</h3>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select Excel File</Form.Label>
        <Form.Control
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </Form.Group>

      {data.length > 0 && (
        <div className="mt-4">
          <h5>Preview:</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                {Object.keys(data[0]).map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map((col, idx) => (
                    <td key={idx}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default ImportExcel;
