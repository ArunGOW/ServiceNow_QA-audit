 import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Container, Alert } from 'react-bootstrap';

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  // Hardcoded roles (you can adjust this list)
  const qaAdmins = ["arun@gmail.com", "sagnik@gmail.com"];
  const agents = ["chetana@gmail.com", "vijay@gmail.com", "shristy@gmail.com", "hemant@gmail.com", "sampat@gmail.com", "siva@gmail.com", "aswini@gmail.com"];

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      // Fetch list of allowed users
      const res = await axios.get("http://127.0.0.1:8000/api/users/get/list_users");
      const allowedUsers = res.data; 

      const foundUser = allowedUsers.find(u => u.email === email);
      if (!foundUser) {
        setError("You are not authorized to use this tool.");
        return;
      }

      // Assign role
      let role = "agent";
      if (qaAdmins.includes(email)) {
        role = "qa";
      } else if (agents.includes(email)) {
        role = "agent";
      }

      login(email, role, foundUser.full_name); // include full_name
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
