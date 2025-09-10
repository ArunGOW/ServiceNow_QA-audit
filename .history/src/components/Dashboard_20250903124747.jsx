 import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome {user?.name || user?.email}</h2>
      <h4>Role: {user?.role || "Not Assigned"}</h4>

      {user?.role === "Agent" && <p>📋 Agent Dashboard Content</p>}
      {user?.role === "QA Admin" && <p>✅ QA Admin Dashboard Content</p>}
    </div>
  );
};

export default Dashboard;
