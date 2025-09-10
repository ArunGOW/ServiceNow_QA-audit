 import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Agent" });
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Fetch hardcoded user list
  const fetchUserList = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/users/get/list_users");
    return res.data;
  };

 

 // Simple Form Login (call API directly)
 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/users/login-google", formData);
    console.log("Login API Response:", res.data);

    if (res.data.status === "success") {
      // Map backend response to frontend user object
      const loggedInUser = {
        name: formData.email.split("@")[0], // fallback, since API doesn’t return name
        email: formData.email,
        role: res.data.user_type === "agent" ? "Agent" : "QA Admin",
        user_sid: res.data.user_sid,
      };

      login(loggedInUser);
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed");
  }
};




  // Create User API
  const handleCreateUser = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/users/create", newUser);
      setShow(false);
      alert("User created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>

      

      {/* Simple Login */}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>

      {/* Create User Button */}
      <button
        className="btn btn-secondary w-100 mt-3"
        onClick={() => setShow(true)}
      >
        Create User
      </button>

      {/* Modal */}
      {show && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShow(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Email</label>
                 <input
  type="email"
  className="form-control"
  value={newUser.email}
  onChange={(e) => {
    console.log("value", e);
    setNewUser({ ...newUser, email: e.target.value });
  }}
/>

                </div>
                <div className="mb-2">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option>Agent</option>
                    <option>QA Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateUser}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
