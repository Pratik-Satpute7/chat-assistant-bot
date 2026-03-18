import "../styles/login.css";

// Google OAuth component
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
// Axios for API requests
import axios from "axios";

// Auth helpers
import { saveUser, saveToken } from "../services/auth";

function Login() {
  const navigate = useNavigate();
  // Function that runs when Google login is successful
  const handleGoogleSuccess = async (credentialResponse) => {
    try {

      // Google sends an ID token in credentialResponse.credential
      const googleToken = credentialResponse.credential;

      // Send token to backend API for verification
      const response = await axios.post(
        "http://localhost:8000/auth/google-login", // FastAPI endpoint
        {
          token: googleToken
        }
      );

      // Backend returns user info
      const user = response.data;
       console.log("Login success:", user);
      // Save user info and token locally for future API calls
      saveUser(user);
      saveToken(googleToken);

      console.log("Login token:", googleToken);

      // Redirect to chat page
      navigate("/chat");

    } catch (error) {

      // Handle error if API fails
      console.error("Login failed:", error);

      alert("Google login failed. Please try again.");

    }
  };

  // Function if Google login fails
  const handleGoogleError = () => {
    console.log("Google Login Failed");
    alert("Google authentication failed");
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>AI Chat Assistant</h1>
        <p>Sign in to continue</p>

        {/* Google OAuth Button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />

      </div>

    </div>
  );
}

export default Login;