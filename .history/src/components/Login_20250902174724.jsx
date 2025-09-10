 import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button, Modal, Table, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().required("Password required"),
});

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users when modal is opened
  const handleShow = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/get/list_users");
      setUsers(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/login-google", values);
      if (res.data.success) {
        // Save token/user info if needed
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard"); // redirect to dashboard
      } else {
        setErrors({ email: "Invalid credentials" });
      }
    } catch (error) {
      setErrors({ email: "Login failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Row>
        <Col>
          <Card className="p-4 shadow-lg rounded">
            <h3 className="text-center mb-4">Login</h3>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label>Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>

                  <div className="mb-3">
                    <label>Password</label>
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-100 mb-2">
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Create User Button */}
            <Button variant="secondary" className="w-100" onClick={handleShow}>
              Create User
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Modal to show users */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{index + 1}</td>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
