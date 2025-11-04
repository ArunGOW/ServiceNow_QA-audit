import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8000/api/users/login-google";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

 const handleSuccess = async (credentialResponse) => {
  try {
    setLoading(true);

    const decoded = jwtDecode(credentialResponse.credential);

    if (!decoded.email_verified) {
      alert("Email not verified");
      setLoading(false);
      return;
    }

    // ✅ Call context login with email only
    const success = await login(decoded.email);

    if (success) {
      alert(`Welcome ${decoded.name}!`);
      navigate("/dashboard/pending-qa");
    } else {
      alert("Login failed!");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};



  const handleError = () => {
    alert("Google login failed.");
  };

  return (
    <GoogleOAuthProvider clientId="333931502051-2am83v0nue2d2rugftbel9opfjo6o5g7.apps.googleusercontent.com">
      <Container
        fluid
        className="d-flex vh-100 justify-content-center align-items-center bg-light"
      >
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-4 text-center">
                <h2 className="mb-4 fw-bold">Login In To Your Account</h2>
                

                {loading ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Login;





// // src/pages/Login.jsx
// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import api from "../api/axois";   // ✅ use centralized api
// // import { Modal, Button, Form, Card } from "react-bootstrap";
// // import axios from "axios";

// // const Login = () => {
// //   const { login } = useAuth();
// //   const navigate = useNavigate();
// //   const [show, setShow] = useState(false);
// //   const [newUser, setNewUser] = useState({ name: "", email: "", role: "Agent" });
// //   const [formData, setFormData] = useState({ email: "", password: "" });

// //   // ✅ Login API
// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     try {
// //       // inside login()
// // const res = await axios.post("http://localhost:8000/api/users/login-google", { ...credentials });
// // console.log("LOGIN API res", res.data)

// // if (res.data.status === "success") {
// //   const userData = {
// //     user_sid: res.data.user_sid,
// //     user_type: res.data.user_type,
// //     token: res.data.session_token,
// //   };

// //   setUser(userData);
// //   localStorage.setItem("user", JSON.stringify(userData));
// //   localStorage.setItem("session_token", res.data.session_token); // 🔑 important
// // }


// //       if (res.data.status === "success") {
// //         // Save token in localStorage for interceptors
// //         localStorage.setItem("session_token", res.data.session_token);

// //         const loggedInUser = {
// //           name: formData.email.split("@")[0],
// //           email: formData.email,
// //           role: res.data.user_type === "agent" ? "Agent" : "QA Admin",
// //           user_sid: res.data.user_sid,
// //         };

// //         login(loggedInUser);
// //         navigate("/dashboard/pending-qa");
// //       } else {
// //         alert("Invalid credentials");
// //       }
// //     } catch (err) {
// //       console.error("Login error:", err.response?.data || err.message);
// //       alert("Login failed");
// //     }
// //   };

  
// //   // ✅ Create User API
// //   const handleCreateUser = async () => {
// //     try {
// //       await api.post("/users/create", newUser);  // ✅ api handles token
// //       setShow(false);
// //       alert("User created successfully!");
// //     } catch (err) {
// //       console.error("Create user error:", err.response?.data || err.message);
// //       alert("Failed to create user");
// //     }
// //   };

// //   return (
// //     <div
// //       className="d-flex align-items-center justify-content-center vh-100"
// //       style={{ background: "linear-gradient(135deg, #6f42c1, #0d6efd)" }}
// //     >
// //       <Card className="shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
// //         <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>

// //         {/* Login Form */}
// //         <Form onSubmit={handleLogin}>
// //           <Form.Group className="mb-3">
// //             <Form.Label className="fw-semibold">Email</Form.Label>
// //             <Form.Control
// //               type="email"
// //               placeholder="Enter your email"
// //               value={formData.email}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, email: e.target.value })
// //               }
// //               required
// //             />
// //           </Form.Group>

// //           <Form.Group className="mb-3">
// //             <Form.Label className="fw-semibold">Password</Form.Label>
// //             <Form.Control
// //               type="password"
// //               placeholder="Enter your password"
// //               value={formData.password}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, password: e.target.value })
// //               }
// //               required
// //             />
// //           </Form.Group>

// //           <Button type="submit" variant="primary" className="w-100 fw-semibold">
// //             🔑 Login
// //           </Button>
// //         </Form>

// //         {/* Create User Button */}
// //         <Button
// //           variant="outline-secondary"
// //           className="w-100 mt-3 fw-semibold"
// //           onClick={() => setShow(true)}
// //         >
// //           ➕ Create User
// //         </Button>
// //       </Card>

// //       {/* Create User Modal */}
// //       <Modal show={show} onHide={() => setShow(false)} centered>
// //         <Modal.Header closeButton className="bg-primary text-white">
// //           <Modal.Title className="fw-bold">➕ Create User</Modal.Title>
// //         </Modal.Header>

// //         <Modal.Body className="p-4 bg-light">
// //           <Form>
// //             <Form.Group className="mb-3">
// //               <Form.Label className="fw-semibold">Name</Form.Label>
// //               <Form.Control
// //                 type="text"
// //                 placeholder="Enter full name"
// //                 value={newUser.name}
// //                 onChange={(e) =>
// //                   setNewUser({ ...newUser, name: e.target.value })
// //                 }
// //                 className="shadow-sm"
// //               />
// //             </Form.Group>

// //             <Form.Group className="mb-3">
// //               <Form.Label className="fw-semibold">Email</Form.Label>
// //               <Form.Control
// //                 type="email"
// //                 placeholder="Enter email address"
// //                 value={newUser.email}
// //                 onChange={(e) =>
// //                   setNewUser({ ...newUser, email: e.target.value })
// //                 }
// //                 className="shadow-sm"
// //               />
// //             </Form.Group>

// //             <Form.Group className="mb-3">
// //               <Form.Label className="fw-semibold">Role</Form.Label>
// //               <Form.Select
// //                 value={newUser.role}
// //                 onChange={(e) =>
// //                   setNewUser({ ...newUser, role: e.target.value })
// //                 }
// //                 className="shadow-sm"
// //               >
// //                 <option>Agent</option>
// //                 <option>QA Admin</option>
// //               </Form.Select>
// //             </Form.Group>
// //           </Form>
// //         </Modal.Body>

// //         <Modal.Footer className="bg-light">
// //           <Button
// //             variant="outline-secondary"
// //             onClick={() => setShow(false)}
// //             className="px-4 fw-semibold"
// //           >
// //             ❌ Cancel
// //           </Button>
// //           <Button
// //             variant="success"
// //             onClick={handleCreateUser}
// //             className="px-4 fw-semibold"
// //           >
// //             💾 Save
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default Login;


// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import axios from "axios";
// // import { Button, Card } from "react-bootstrap";

// // const Login = () => {
// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   const handleLogin = async () => {
// //     try {
// //       // API payload with only email
// //       const payload = { email: "arun@gmail.com" };

// //       const res = await axios.post(
// //         "http://localhost:8000/api/users/login-google",
// //         payload,
// //         { headers: { "Content-Type": "application/json" } }
// //       );

// //       console.log("Login API response:", res.data);

// //       if (res.data.status === "success") {
// //         // Save user info in context & localStorage
// //         const userData = {
// //           user_sid: res.data.user_sid,
// //           user_type: res.data.user_type,
// //           token: res.data.session_token,
// //         };

// //         login(userData); // context
// //         localStorage.setItem("user", JSON.stringify(userData));
// //         localStorage.setItem("session_token", res.data.session_token);

// //         // Navigate to dashboard
// //         navigate("/dashboard/pending-qa");
// //       } else {
// //         alert("Login failed!");
// //       }
// //     } catch (err) {
// //       console.error("Login error:", err.response?.data || err.message);
// //       alert("Login failed!");
// //     }
// //   };

// //   return (
// //     <div
// //       className="d-flex align-items-center justify-content-center vh-100"
// //       style={{ background: "linear-gradient(135deg, #6f42c1, #0d6efd)" }}
// //     >
// //       <Card className="shadow-lg p-4 rounded-4 text-center">
// //         <h2 className="mb-4  fw-bold"> Login In To Your Account </h2>
// //         <Button variant="success" onClick={handleLogin} className="fw-semibold">
// //           🔑 Login using Google 
// //         </Button>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default Login;


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Button, Card } from "react-bootstrap";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//    const email = "arun@gmail.com"

//     const success = await login(email);
//     if (success) {
//       navigate("/dashboard/pending-qa");
//     } else {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div
//       className="d-flex align-items-center justify-content-center vh-100"
//       style={{ background: "linear-gradient(135deg, #6f42c1, #0d6efd)" }}
//     >
//       <Card className="shadow-lg p-4 rounded-4 text-center" style={{ width: "400px" }}>
//         <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>
//         <Button
//           variant="primary"
//           className="w-100 fw-semibold"
//           onClick={handleLogin}
//         >
//           🔑 Login with Google
//         </Button>
//       </Card>
//     </div>
//   );
// };

// export default Login;


// today//

// import React from "react";
// import axios from "axios";

// const Login = () => {
//   const handleLogin = async () => {
//     try {
//       // Hardcoded email (replace with dynamic if needed later)
//       const response = await axios.post("http://localhost:8000/api/users/login-google", {
//         email: "arun@gmail.com", email:"sagnik@gmail.com"
//       });

//       if (response.data.status === "success") {
//         // Save token & user info in localStorage
//         localStorage.setItem("session_token", response.data.session_token);
//         localStorage.setItem("user_sid", response.data.user_sid);
//         localStorage.setItem("user_type", response.data.user_type);

//         alert("✅ Login successful!");
//         window.location.href = "/dashboard/pending-qa"; // redirect after login
//       }
//     } catch (error) {
//       console.error("❌ Login failed:", error);
//       alert("Login failed. Please try again.");
//     }
//   };

//   return (
//     <div style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}>
//       <button
//         onClick={handleLogin}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: "white",
//           color: "black",
//           border: "1px solid #ddd",
//           borderRadius: "4px",
//           padding: "10px 20px",
//           fontSize: "16px",
//           cursor: "pointer",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         }}
//       >
//         <img
//           src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
//           alt="google"
//           style={{ width: "20px", marginRight: "10px" }}
//         />
//         Login with Google
//       </button>
//     </div>
//   );
// };

// export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Button, Card, Modal, ListGroup, Spinner } from "react-bootstrap";
 
// import api from "../api/axois";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch users when modal opens
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("http://localhost:8000/api/users/get/list_users");
//       setUsers(res.data); // response is array of users
//     } catch (err) {
//       console.error("❌ Failed to fetch users:", err);
//       alert("Could not load user list");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUserSelect = async (email) => {
//     const success = await login(email);
//     if (success) {
//       setShowModal(false);
//       navigate("/dashboard/pending-qa");
//     } else {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div
//       className="d-flex align-items-center justify-content-center vh-100"
//       style={{ background: "linear-gradient(135deg, #6f42c1, #0d6efd)" }}
//     >
//       <Card className="shadow-lg p-4 rounded-4 text-center" style={{ width: "400px" }}>
//         <h2 className="text-center mb-4 text-light fw-bold">Login</h2>

//         <Button
//           variant="light"
//           className="w-100 fw-semibold d-flex align-items-center justify-content-center"
//           onClick={() => {
//             setShowModal(true);
//             fetchUsers();
//           }}
//           style={{ gap: "8px" }}
//         >
//           <img
//             src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
//             alt="google"
//             style={{ width: "20px", height: "20px" }}
//           />
//           Login with Google
//         </Button>
//       </Card>

//       {/* User selection modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Select a User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {loading ? (
//             <div className="text-center">
//               <Spinner animation="border" />
//             </div>
//           ) : (
//             <ListGroup>
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <ListGroup.Item
//                     key={user.sid}
//                     action
//                     onClick={() => handleUserSelect(user.email)}
//                   >
//                     <strong>{user.full_name}</strong> <br />
//                     <small className="text-muted">{user.email}</small>
//                   </ListGroup.Item>
//                 ))
//               ) : (
//                 <p>No users found</p>
//               )}
//             </ListGroup>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Login;
 // src/components/Login.jsx
// import React from "react";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";

// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Container, Card, Spinner } from "react-bootstrap";

// const Login = () => {
//   const navigate = useNavigate();
//   const { setAuthData } = useAuth();
//   const [loading, setLoading] = React.useState(false);

//   const handleLoginSuccess = async (credentialResponse) => {
//     setLoading(true);
//     try {
//       const decoded = jwtDecode(credentialResponse.credential);
//       const email = decoded.email;
//       console.log("✅ Google Login Success:", email);

//       // // 1️⃣ Fetch user list
//       // const { data: users } = await axios.get("http://localhost:8000/api/users/get/list_users");
//       // const matchedUser = users.find((user) => user.email === email);

//       // if (!matchedUser) {
//       //   alert("❌ You are not an authorized user.");
//       //   setLoading(false);
//       //   return;
//       // }

//       // 2️⃣ Call login-google API
//       const response = await axios.post("http://localhost:8000/api/users/login-google", {
//         token: credentialResponse.credential,
//         email: email,
//       });

//       console.log("🔐 Login Response:", response.data);

//       if (response.data.status === "success") {
//         // Store in context + localStorage
//         const userData = {
//           session_token: response.data.session_token,
//           user_sid: response.data.user_sid,
//           user_type: response.data.user_type,
//           email,
//         };
//         localStorage.setItem("userData", JSON.stringify(userData));
//         setAuthData(userData);

//         alert("✅ Login successful!");
//         navigate("/dashboard");
//       } else {
//         alert("⚠️ Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("❌ Login error:", error);
//       alert("Error during login process");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginError = () => alert("Google login failed");

//   return (
//     <GoogleOAuthProvider clientId="333931502051-2am83v0nue2d2rugftbel9opfjo6o5g7.apps.googleusercontent.com">
//       <Container className="d-flex justify-content-center align-items-center vh-100">
//         <Card className="p-4 shadow-lg text-center" style={{ width: "400px" }}>
//           <h3 className="mb-4 text-primary fw-bold">Login</h3>
//           {loading ? (
//             <Spinner animation="border" variant="primary" />
//           ) : (
//             <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
//           )}
//         </Card>
//       </Container>
//     </GoogleOAuthProvider>
//   );
// };

// export default Login;
