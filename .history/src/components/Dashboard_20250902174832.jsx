import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container className="mt-5">
      <h2>Welcome, {user?.name || "User"} 🎉</h2>
      <p>Your email: {user?.email}</p>
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}
