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

  // Google Login
  // const handleGoogleLogin = async () => {
  //   try {
  //     const res = await axios.post("http://127.0.0.1:8000/api/users/login-google");
  //     const userList = await fetchUserList();
  //     const foundUser = userList.find((u) => u.email === res.data.email);

  //     if (foundUser) {
  //       login(foundUser);
  //       navigate("/dashboard");
  //     } else {
  //       alert("User not found in allowed list");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Google login failed");
  //   }
  // };

  // Simple Form Login
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const userList = await fetchUserList();
  //   const foundUser = userList.find(
  //     (u) => u.email === formData.email && u.password === formData.password
  //   );

  //   if (foundUser) {
  //     login(foundUser);
  //     navigate("/dashboard");
  //   } else {
  //     alert("Invalid credentials");
  //   }
  // };



  // Google Login
const handleGoogleLogin = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/users/login-google");
    console.log("Google Login API Response:", res.data); // 👈 log response

    const userList = await fetchUserList();
    console.log("User List API Response:", userList); // 👈 log user list

    const foundUser = userList.find((u) => u.email === res.data.email);

    if (foundUser) {
      login(foundUser);
      navigate("/dashboard");
    } else {
      alert("User not found in allowed list");
    }
  } catch (err) {
    console.error("Google login error:", err);
    alert("Google login failed");
  }
};

 // Simple Form Login
const handleLogin = async (e) => {
  e.preventDefault();
  const userList = await fetchUserList();
  console.log("User List API Response:", userList);

  const foundUser = userList.find((u) => u.email === formData.email);

  if (foundUser) {
  console.log("User from list:", foundUser); // 👀 Debug
  login(foundUser);
  navigate("/dashboard");
  } else {
    console.warn("Invalid login attempt with:", formData);
    alert("Invalid credentials");
  }

  
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

      {/* Google Login */}
      <button
        className="btn btn-danger w-100 mb-3"
        onClick={handleGoogleLogin}
      >
        Login with Google
      </button>

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
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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
