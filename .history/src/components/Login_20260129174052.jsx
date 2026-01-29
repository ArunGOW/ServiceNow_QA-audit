
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Spinner } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { ToastContainer, toast } from "react-toastify";

// // ✅ Google OAuth Client ID
//  const CLIENT_ID ="333931502051-2am83v0nue2d2rugftbel9opfjo6o5g7.apps.googleusercontent.com";
   
//   // 441529980333-hj4g0d9jpk14fv9m7a9dk0fq6ieb0208.apps.googleusercontent.com
 
// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth(); // Access login function from AuthContext
//   const [loading, setLoading] = useState(false); // State to show spinner during login

//   /**
//    * ✅ useEffect: Load the Google Identity Services script dynamically
//    * This script enables Google OAuth 2.0 token-based login.
//    */
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;
//     document.body.appendChild(script);
//   }, []);

//   /**
//    * ✅ handleGoogleLogin: Triggered when the user clicks the "Login Using Google" button
//    * - Initializes Google OAuth2 Token Client
//    * - Gets access token from Google
//    * - Fetches user info (email, name, picture)
//    * - Calls backend `login()` from AuthContext
//    * - Redirects to dashboard on success
//    */
//  const handleGoogleLogin = () => {
//   // 🔍 DEBUG: Log the exact origin Google is checking against
//   console.log("Current Application Origin:", window.location.origin);

//   if (!window.google) {
//     toast.error("Google login not ready yet. Please wait a second and try again.");
//     return;
//   }

//   // Initialize Google OAuth2 token client
//   const client = window.google.accounts.oauth2.initTokenClient({
//     client_id: CLIENT_ID,
//     scope: "openid email profile",
//     // ✅ ADD THIS: Ensuring the hint matches the origin if needed
//     ux_mode: "popup", 
//     callback: async (tokenResponse) => {
//       if (tokenResponse.error) {
//         console.error("Google Auth Error:", tokenResponse.error);
//         return toast.error("Auth failed: " + tokenResponse.error_description);
//       }

//       try {
//         setLoading(true);
//         const { access_token } = tokenResponse;

//         // ✅ Fetch user info using the access token
//         const userInfo = await axios.get(
//           "https://www.googleapis.com/oauth2/v3/userinfo",
//           {
//             headers: { Authorization: `Bearer ${access_token}` },
//           }
//         );

//         const { email, name, picture } = userInfo.data;

//         if (!email) {
//           toast.error("Unable to fetch email from Google account.");
//           setLoading(false);
//           return;
//         }

//         // ✅ Call backend AuthContext login with user details
//         const success = await login(email, name, picture);

//         if (success) {
//           toast.success(`Welcome ${name || email}!`);
//           navigate("/dashboard/alluser-dashboard");
//         } else {
//           toast.error("Login failed!");
//         }
//       } catch (err) {
//         console.error("❌ Google Login Error:", err);
//         toast.error("Something went wrong during Google login.");
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   // ✅ Request Google access token
//   client.requestAccessToken();
// };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         backgroundColor: "#fff",
//       }}
//     >
//       <div style={{ textAlign: "center" }}>
//         <h2 style={{ fontWeight: 600, marginBottom: "2rem" }}>
//           Login In To Your Account
//         </h2>

//         {/* ✅ Show loading spinner when authenticating */}
//         {loading ? (
//           <Spinner animation="border" role="status" />
//         ) : (
//           // ✅ Google Login Button
//           <button
//             onClick={handleGoogleLogin}
//             style={{
//               backgroundColor: "#1a3e9e",
//               color: "white",
//               border: "none",
//               borderRadius: "8px",
//               padding: "16px 32px",
//               fontSize: "16px",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               cursor: "pointer",
//               margin: "0 auto",
//               fontWeight: 500,
//               transition: "background-color 0.3s ease",
//             }}
//             onMouseEnter={(e) => (e.target.style.backgroundColor = "#15348a")}
//             onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a3e9e")}
//           >
//             <img
//               src="https://www.svgrepo.com/show/475656/google-color.svg"
//               alt="Google"
//               style={{ width: "24px", height: "24px" }}
//             />
//             Login Using Google
//           </button>
//         )}
//       </div>

//       {/* ✅ Toast notifications container */}
//       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
//     </div>
//   );
// };

// export default Login;



// // logger added code 


// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Spinner } from "react-bootstrap";
// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import { ToastContainer, toast } from "react-toastify";
// // import logger from "../utils/logger";

// // // Google OAuth Client ID
// // const CLIENT_ID =
// // // "333931502051-2am83v0nue2d2rugftbel9opfjo6o5g7.apps.googleusercontent.com";
// // "674709009669-9ujsu99k43pp14t922nvvhal0knfi1at.apps.googleusercontent.com";

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();
// //   const [loading, setLoading] = useState(false);

// //   // Load Google OAuth script
// //   useEffect(() => {
// //     logger.info("Login page mounted – loading Google SDK");

// //     const script = document.createElement("script");
// //     script.src = "https://accounts.google.com/gsi/client";
// //     script.async = true;
// //     script.defer = true;
// //     document.body.appendChild(script);

// //     script.onload = () => logger.info("Google SDK loaded successfully");
// //     script.onerror = () => logger.error("Failed to load Google SDK");
// //   }, []);

// //   // Google Login Handler
// //   const handleGoogleLogin = () => {
// //     logger.info("Google login button clicked");

// //     if (!window.google) {
// //       logger.warn("Google SDK not ready");
// //       toast.error("Google login not ready yet. Please wait a second and try again.");
// //       return;
// //     }

// //     const client = window.google.accounts.oauth2.initTokenClient({
// //       client_id: CLIENT_ID,
// //       scope: "openid email profile",
// //       callback: async (tokenResponse) => {
// //         logger.info("Google token received:", tokenResponse);

// //         try {
// //           setLoading(true);

// //           const { access_token } = tokenResponse;

// //           // Fetch Google user info
// //           const userInfo = await axios.get(
// //             "https://www.googleapis.com/oauth2/v3/userinfo",
// //             {
// //               headers: { Authorization: `Bearer ${access_token}` },
// //             }
// //           );

// //           logger.info("Google User Info:", userInfo.data);

// //           const { email, name, picture } = userInfo.data;

// //           if (!email) {
// //             logger.error("Google account has no email");
// //             toast.error("Unable to fetch email from Google account.");
// //             setLoading(false);
// //             return;
// //           }

// //           // Send login to backend
// //           logger.info("Sending login request to backend:", email);

// //           const success = await login(email, name, picture);

// //           if (success) {
// //             logger.info("Login successful:", { email, name });
// //             toast.success(`Welcome ${name || email}!`);
// //             navigate("/dashboard/pending-qa");
// //           } else {
// //             logger.warn("Unauthorized login attempt:", email);
// //             toast.error("QA-Admin only login!"); // Updated message
// //           }
// //         } catch (err) {
// //           logger.error("Google Login Error:", err);
// //           toast.error("Something went wrong during Google login.");
// //         } finally {
// //           setLoading(false);
// //           logger.info("Login process completed");
// //         }
// //       },
// //     });

// //     client.requestAccessToken();
// //   };

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         height: "100vh",
// //         backgroundColor: "#fff",
// //       }}
// //     >
// //       <div style={{ textAlign: "center" }}>
// //         <h2 style={{ fontWeight: 600, marginBottom: "2rem" }}>
// //           Login In To Your Account
// //         </h2>

// //         {loading ? (
// //           <Spinner animation="border" role="status" />
// //         ) : (
// //           <button
// //             onClick={handleGoogleLogin}
// //             style={{
// //               backgroundColor: "#1a3e9e",
// //               color: "white",
// //               border: "none",
// //               borderRadius: "8px",
// //               padding: "16px 32px",
// //               fontSize: "16px",
// //               display: "flex",
// //               alignItems: "center",
// //               gap: "8px",
// //               cursor: "pointer",
// //               margin: "0 auto",
// //               fontWeight: 500,
// //               transition: "background-color 0.3s ease",
// //             }}
// //             onMouseEnter={(e) => (e.target.style.backgroundColor = "#15348a")}
// //             onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a3e9e")}
// //           >
// //             <img
// //               src="https://www.svgrepo.com/show/475656/google-color.svg"
// //               alt="Google"
// //               style={{ width: "24px", height: "24px" }}
// //             />
// //             Login Using Google
// //           </button>
// //         )}
// //       </div>

// //       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
// //     </div>
// //   );
// // };

// // export default Login;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const CLIENT_ID ="441529980333-hj4g0d9jpk14fv9m7a9dk0fq6ieb0208.apps.googleusercontent.com";
 
 // "333931502051-2am83v0nue2d2rugftbel9opfjo6o5g7.apps.googleusercontent.com"; local host code


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

 
 useEffect(() => {
  if (user) {
    // If user exists (regardless of role), send them to the dashboard
    navigate("/dashboard/alluser-dashboard");
  }
}, [user, navigate]);

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

          const loggedInUser = await login(email, name, picture);

          if (loggedInUser) {
  toast.success(`Welcome ${name || email}!`);
  
  // Navigate to the dashboard for ANY valid logged-in user
  navigate("/dashboard/alluser-dashboard");
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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
