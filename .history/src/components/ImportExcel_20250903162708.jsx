// 
import React, { useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";

const ImportExcel = () => {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h3>Import Incidents from Excel</h3>
        <Form.Group className="mt-3">
          <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </Form.Group>

        {excelData.length > 0 && (
          <div className="mt-4">
            <h5>Preview Data:</h5>
            <pre>{JSON.stringify(excelData, null, 2)}</pre>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default ImportExcel;
