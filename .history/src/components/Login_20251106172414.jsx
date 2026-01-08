// import React, { useState } from "react";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
// import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const API_URL = "http://localhost:8000/api/users/login-google";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [loading, setLoading] = useState(false);

//  const handleSuccess = async (credentialResponse) => {
//   try {
//     setLoading(true);

//     const decoded = jwtDecode(credentialResponse.credential);

//     if (!decoded.email_verified) {
//       alert("Email not verified");
//       setLoading(false);
//       return;
//     }

//     // ✅ Call context login with email only
//     const success = await login(decoded.email);

//     if (success) {
//       alert(`Welcome ${decoded.name}!`);
//       navigate("/dashboard/pending-qa");
//     } else {
//       alert("Login failed!");
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Something went wrong!");
//   } finally {
//     setLoading(false);
//   }
// };



//   const handleError = () => {
//     alert("Google login failed.");
//   };

//   return (
//     <GoogleOAuthProvider clientId="333931502051-2am83v0nue2d2rugftbel9opfjo6o5g7.apps.googleusercontent.com">
//       <Container
//         fluid
//         className="d-flex vh-100 justify-content-center align-items-center bg-light"
//       >
//         <Row className="w-100 justify-content-center">
//           <Col xs={12} sm={8} md={6} lg={4}>
//             <Card className="shadow-lg border-0 rounded-4">
//               <Card.Body className="p-4 text-center">
//                 <h2 className="mb-4 fw-bold">Login In To Your Account</h2>
                

//                 {loading ? (
//                   <Spinner animation="border" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </Spinner>
//                 ) : (
//                   <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </GoogleOAuthProvider>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const CLIENT_ID =
  "333931502051-2am83v0nue2d2rugftbel9opfjo6o5g7.apps.googleusercontent.com";
  // "674709009669-1sbainjtfkkf5ai3v4o2ovftib7uafmn.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Load Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = () => {
    if (!window.google) {
      toast.error("Google login not ready yet. Please wait a second and try again.");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid email profile",
      callback: async (tokenResponse) => {
        try {
          setLoading(true);

          // ✅ Get user info using the access token
          const { access_token } = tokenResponse;
          const userInfo = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );

          console.log("🧩 Google User Info:", userInfo.data);

           const { email, name, picture } = userInfo.data;

          if (!email) {
             toast.error("Unable to fetch email from Google account.");
            setLoading(false);
            return;
          }

          // ✅ Call backend login with email
          const success = await login(email, name,picture);
          if (success) {
             toast.success(`Welcome ${name || email}!`);
            navigate("/dashboard/pending-qa");
          } else {
            alert("Login failed!");
          }
        } catch (err) {
          console.error("Google Login Error:", err);
          alert("Something went wrong during Google login.");
        } finally {
          setLoading(false);
        }
      },
    });

    client.requestAccessToken();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontWeight: 600, marginBottom: "2rem" }}>
          Login In To Your Account
        </h2>

        {loading ? (
          <Spinner animation="border" role="status" />
        ) : (
          <button
            onClick={handleGoogleLogin}
            style={{
              backgroundColor: "#1a3e9e",
              color: "white",
              border: "none", 
              borderRadius: "8px",
              padding: "16px 32px",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              margin: "0 auto",
              fontWeight: 500,
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#15348a")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a3e9e")}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={{ width: "24px", height: "24px" }}
            />
            Login Using Google
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;




 