import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, Container, Form, Table } from "react-bootstrap";

const ImportExcel = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0]; // take first sheet
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("Imported Data:", jsonData);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Container className="mt-5">
      <h3>Import Issues from Excel</h3>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select Excel File</Form.Label>
        <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
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

export default ImporExcel;
