 import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Container, Alert } from 'react-bootstrap';

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      // Fetch user list from backend
      const res = await axios.get("http://127.0.0.1:8000/api/users/get/list_users");
      const allowedUsers = res.data; // assume array of { email, role }

      const foundUser = allowedUsers.find(u => u.email === email);
      if (foundUser) {
        login(foundUser.email, foundUser.role); // role: "agent" or "qa"
      } else {
        setError("You are not authorized to use this tool.");
      }
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 400 }}>
      <h3>QA Tool Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError("Login failed")}
      />
    </Container>
  );
}
