 import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { ROLES } from "../constants/roles"; // Make sure you have your roles constants

const CLIENT_ID = "333931502051-2am83v0nue2d2rugftbel9opfjo6o5g7.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Load Google SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = () => {
    if (!window.google) {
      toast.error("Google login not ready yet.");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid email profile",
      ux_mode: "popup",
      callback: async (tokenResponse) => {
        try {
          setLoading(true);

          const { access_token } = tokenResponse;
          const userInfo = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );

          const { email, name, picture } = userInfo.data;

          // ✅ login function should return user object including user_type
          const loggedInUser = await login(email, name, picture);

          if (loggedInUser) {
            toast.success(`Welcome ${name || email}!`);

            // ✅ Redirect based on role
            if (loggedInUser.user_type === ROLES.ADMIN) {
              navigate("/dashboard/alluser-dashboard");
            } else if (loggedInUser.user_type === ROLES.AGENT) {
              navigate("/dashboard/user-dashboard");
            } else {
              toast.error("Unauthorized user role!");
            }
          } else {
            toast.error("Unauthorized user!");
          }
        } catch (err) {
          console.error(err);
          toast.error("Google login failed.");
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
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>Login In To Your Account</h2>

        {loading ? (
          <Spinner animation="border" />
        ) : (
          <button
            onClick={handleGoogleLogin}
            style={{
              backgroundColor: "#1a3e9e",
              color: "white",
              padding: "16px 32px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login Using Google
          </button>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;
