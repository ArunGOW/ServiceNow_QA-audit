 import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import UserList from "../components/UserList";
 

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container className="mt-5">
      <h2>Welcome, {user?.name}</h2>
      <p>Role: {user?.role}</p>

      {user?.role === "Agent" && <h4>Agent Dashboard: Handle tickets</h4>}
      {user?.role === "QA Admin" && (
        <>
          <h4>QA Admin Dashboard: Manage Agents</h4>
         < UserList />
        </>
      )}

      <Button className="mt-3" variant="danger" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
