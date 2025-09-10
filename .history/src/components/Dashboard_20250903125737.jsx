 import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import UserList from "../components/UserList";
import { useNavigate } from "react-router-dom"; // ⬅️ you forgot this
import ImportExcel from "./ImportExcel";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ⬅️ now it's defined

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect back to login page
  };

  return (
    <Container className="mt-5">
      <h2>Welcome, {user?.name}</h2>
      <p>Role: {user?.role}</p>

      {user?.role === "Agent" && <h4>Agent Dashboard: Handle tickets</h4>}
      {user?.role === "QA Admin" && (
        <>
          <h4>QA Admin Dashboard: Manage Agents</h4>
          <UserList />
          <ImportExcel />
        </>
      )}

      <Button className="mt-3" variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
