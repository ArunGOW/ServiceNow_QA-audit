 // src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Alert } from "react-bootstrap";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "" });
  const [showModal, setShowModal] = useState(false);
  const [createUserData, setCreateUserData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  // Handle Login (only email)
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login-google", loginData);
      setMessage(`✅ Login successful: ${response.data.message || "Welcome!"}`);
    } catch (error) {
      setMessage(`❌ Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle Create User
  const handleCreateUser = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/create-user", createUserData);
      setMessage(`✅ User created: ${response.data.message || createUserData.email}`);
      setShowModal(false);
    } catch (error) {
      setMessage(`❌ Failed to create user: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="p-4 shadow rounded bg-white" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {message && <Alert variant="info">{message}</Alert>}

        <div className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={loginData.email}
            onChange={(e) => setLoginData({ email: e.target.value })}
          />
        </div>

        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="success" onClick={() => setShowModal(true)}>
            Create User
          </Button>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={createUserData.name}
              onChange={(e) => setCreateUserData({ ...createUserData, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={createUserData.email}
              onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreateUser}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
