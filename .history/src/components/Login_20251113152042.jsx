
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

// ✅ Google OAuth Client ID
const CLIENT_ID =
  "674709009669-3519te6nrkibu3lli3unbt8r46s30a26.apps.googleusercontent.com";// local host CD

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function from AuthContext
  const [loading, setLoading] = useState(false); // State to show spinner during login

  /**
   * ✅ useEffect: Load the Google Identity Services script dynamically
   * This script enables Google OAuth 2.0 token-based login.
   */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  /**
   * ✅ handleGoogleLogin: Triggered when the user clicks the "Login Using Google" button
   * - Initializes Google OAuth2 Token Client
   * - Gets access token from Google
   * - Fetches user info (email, name, picture)
   * - Calls backend `login()` from AuthContext
   * - Redirects to dashboard on success
   */
  const handleGoogleLogin = () => {
    // If Google SDK hasn't loaded yet
    if (!window.google) {
      toast.error("Google login not ready yet. Please wait a second and try again.");
      return;
    }

    // Initialize Google OAuth2 token client
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid email profile", // Required scopes for user data
      callback: async (tokenResponse) => {
        try {
          setLoading(true);
          const { access_token } = tokenResponse;

          // ✅ Fetch user info using the access token
          const userInfo = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );

          console.log("🧩 Google User Info:", userInfo.data);

          const { email, name, picture } = userInfo.data;

          // If email not found in Google profile
          if (!email) {
            toast.error("Unable to fetch email from Google account.");
            setLoading(false);
            return;
          }

          // ✅ Call backend AuthContext login with user details
          const success = await login(email, name, picture);

          if (success) {
            toast.success(`Welcome ${name || email}!`);
            navigate("/dashboard/pending-qa");
          } else {
            toast.error("Login failed!");
          }
        } catch (err) {
          console.error("❌ Google Login Error:", err);
          toast.error("Something went wrong during Google login.");
        } finally {
          setLoading(false);
        }
      },
    });

    // ✅ Request Google access token (this opens Google account popup)
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

        {/* ✅ Show loading spinner when authenticating */}
        {loading ? (
          <Spinner animation="border" role="status" />
        ) : (
          // ✅ Google Login Button
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

      {/* ✅ Toast notifications container */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Login;
