import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(email);
    if (!ok) setError('Unauthorized user');
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 400 }}>
      <h3>QA Tool Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary">Login</Button>
      </Form>
    </Container>
  );
}