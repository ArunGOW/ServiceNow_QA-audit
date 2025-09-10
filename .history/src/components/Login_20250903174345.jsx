 import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Modal, Button, Form, Card } from "react-bootstrap";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Agent" });
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Login API
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/login-google",
        formData
      );
      console.log("Login API Response:", res.data);

      if (res.data.status === "success") {
        const loggedInUser = {
          name: formData.email.split("@")[0],
          email: formData.email,
          role: res.data.user_type === "agent" ? "Agent" : "QA Admin",
          user_sid: res.data.user_sid,
        };

        login(loggedInUser);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  // Create User API
  const handleCreateUser = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/users/create", newUser);
      setShow(false);
      alert("User created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #6f42c1, #0d6efd)",
      }}
    >
      <Card className="shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>

        {/* Login Form */}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 fw-semibold"
          >
            🔑 Login
          </Button>
        </Form>

        {/* Create User Button */}
        <Button
          variant="outline-secondary"
          className="w-100 mt-3 fw-semibold"
          onClick={() => setShow(true)}
        >
          ➕ Create User
        </Button>
      </Card>

      {/* Modal for Create User */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option>Agent</option>
                <option>QA Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
