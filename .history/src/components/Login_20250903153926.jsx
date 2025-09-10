 import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Card, Button, Form, Modal, Container, Row, Col } from "react-bootstrap";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Agent" });
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Fetch hardcoded user list
  const fetchUserList = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/users/get/list_users");
    return res.data;
  };

  // Google Login
  // const handleGoogleLogin = async () => {
  //   try {
  //     const res = await axios.post("http://127.0.0.1:8000/api/users/login-google");
  //     const userList = await fetchUserList();
  //     const foundUser = userList.find((u) => u.email === res.data.email);

  //     if (foundUser) {
  //       login(foundUser);
  //       navigate("/dashboard");
  //     } else {
  //       alert("User not found in allowed list");
  //     }
  //   } catch (err) {
  //     console.error("Google login error:", err);
  //     alert("Google login failed");
  //   }
  // };

  // Simple Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/login-google", formData);
      if (res.data?.status === "success") {
        // Map backend response into user object
        const user = {
          email: formData.email,
          role: res.data.user_type === "agent" ? "Agent" : "QA Admin",
        };
        login(user);
        navigate("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  // Create User
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
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg p-4 rounded-4">
            <Card.Body>
              <h2 className="text-center mb-4 text-primary fw-bold">Welcome Back</h2>
              <p className="text-center text-muted mb-4">
                Please login to continue
              </p>

              {/* Google Login */}
              {/* <Button
                className="w-100 mb-3 rounded-3"
                variant="danger"
                onClick={handleGoogleLogin}
              >
                <i className="bi bi-google me-2"></i> Login with Google
              </Button>

              <div className="text-center text-muted mb-3">OR</div> */}

              {/* Simple Login */}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
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
                  <Form.Label>Password</Form.Label>
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
                  className="w-100 rounded-3"
                  variant="primary"
                >
                  Login
                </Button>
              </Form>

              <Button
                variant="outline-secondary"
                className="w-100 mt-3 rounded-3"
                onClick={() => setShow(true)}
              >
                Create User
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Create User */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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
    </Container>
  );
};

export default Login;
