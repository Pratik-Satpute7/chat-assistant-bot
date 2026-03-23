// 1. Google OAuth sign-in
// 2. Sends Google token to backend for verification
// 3. Saves user info and token in local storage
// 4. Redirects to main chat page after successful login
import "../styles/login.css";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveUser, saveToken } from "../services/auth";
// import API from "../services/api";

// Login page component that handles user authentication via Google OAuth.
// Users can sign in with their Google account to access the chat application.
function Login() {
  const navigate = useNavigate();

  // Function called when Google login succeeds
  // Handles the authentication process with the backend
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Get the Google ID token from the response
      const googleToken = credentialResponse.credential;

      // Send the token to our backend for verification
      // (Commented out alternative local API call)
      // const response = await API.post("/auth/google-login");

      const response = await axios.post(
        "https://chat-assistant-bot-uiue.onrender.com/auth/google-login",
        { token: googleToken }
      );

      // Extract user data from backend response
      const user = response.data;
      
      // Store user info and token in browser storage
      saveUser(user);
      saveToken(googleToken);
      
      // Redirect to the main chat page
      navigate("/chat");

    } catch (error) {
      // Handle any errors during login process
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Function called when Google login fails or is cancelled
  const handleGoogleError = () => {
    console.log("Google Login Failed");
    alert("Google sign-in was not successful.");
  };

  return (
    // Main container for the login page
    <div className="login-container">
      
      <div className="login-card">
        
        {/* App icon at the top */}
        <div className="brand-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>

        {/* Welcome message */}
        <h1>Chat Assistant Bot</h1>
        <p>Sign in to your account to continue</p>

        {/* Google sign-in button container */}
        <div className="google-button-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}  // Called on successful login
            onError={handleGoogleError}      // Called on login failure
            useOneTap         // Shows quick sign-in for returning users
            shape="pill"      // Rounded button style
            theme="outline"   // Clean, outlined appearance
            size="large"      // Large size for easy clicking
            width="100%"      // Full width of container
          />
        </div>

        {/* Footer with legal links */}
        <div className="login-footer">
          By continuing, you agree to our <br />
          <a href="/terms">Terms of Service</a> & <a href="/privacy">Privacy Policy</a>
        </div>

      </div>
    </div>
  );
}

export default Login;