import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>QA Tool</Navbar.Brand>
          <Nav className="me-auto">
            {user.role === 'qa' && <Nav.Link as={Link} to="/">Dashboard</Nav.Link>}
            {user.role === 'qa' && <Nav.Link as={Link} to="/import">Import</Nav.Link>}
            {user.role === 'agent' && <Nav.Link as={Link} to="/">My Dashboard</Nav.Link>}
          </Nav>
          <Nav>
            <Nav.Item className="text-light me-3">{user.name}</Nav.Item>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>{children}</Container>
    </>
  );
}