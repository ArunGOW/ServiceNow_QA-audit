 import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useAuth } from '../context/AuthContext.jsx';
import { Container, Alert } from 'react-bootstrap';

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential; // Google token

      // Send token to backend
      const res = await axios.post("http://127.0.0.1:8000/api/users/login-google", {
        token: token
      });

      // Backend should return { email, full_name, role, access_token }
      const user = res.data;

      if (!user.email) {
        setError("Login failed: no email in response");
        return;
      }

      // Save token for future API calls
      localStorage.setItem("authToken", user.access_token);

      // Use backend-provided role (qa/agent)
      login(user.email, user.role, user.full_name);
    } catch (err) {
      console.error(err);
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
