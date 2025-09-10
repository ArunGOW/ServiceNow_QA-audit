 import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserList from "../components/UserList";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                     // clear context + localStorage
    navigate("/login");           // redirect to login page
  };

  if (!user) {
    // if user is not logged in, redirect (extra safety)
    navigate("/login");
    return null;
  }

  return (
    <Container className="mt-5">
       <h2>Welcome, {user?.name || user?.email}</h2>
<p>Role: {user?.role}</p>


      {user?.role === "Agent" && (
        <div className="mt-4">
          <h4>Agent Dashboard</h4>
          <p>You can handle tickets here.</p>
        </div>
      )}

      {user?.role === "QA Admin" && (
        <div className="mt-4">
          <h4>QA Admin Dashboard</h4>
          <p>You can manage agents below:</p>
          <UserList />
        </div>
      )}

      <Button
        className="mt-4"
        variant="danger"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
