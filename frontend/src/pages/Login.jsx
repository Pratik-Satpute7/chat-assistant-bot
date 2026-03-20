import "../styles/login.css";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveUser, saveToken } from "../services/auth";
// import API from "../services/api";
function Login() {
  const navigate = useNavigate();

  // This function runs if the Google login is successful
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // 1. Get the special ID token that Google sends back
      const googleToken = credentialResponse.credential;

      // 2. Send that token to our backend (FastAPI) to verify it
      // const response = await axios.post(
      //   "http://localhost:8000/auth/google-login",
      //   { token: googleToken }
      // );
      // const response = await API.post("/auth/google-login");

      const response = await axios.post(
        "https://chat-assistant-bot-uiue.onrender.com/auth/google-login",
        { token: googleToken }
      );

      // 3. Get the user data returned by our backend
      const user = response.data;
      
      // 4. Save the user and token in the browser's memory (LocalStorage)
      saveUser(user);
      saveToken(googleToken);
      
      //console.log("Login token:", googleToken);


      
      // 5. Send the user to the Chat page
      navigate("/chat");

    } catch (error) {
      // If something goes wrong with the API or connection
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // This function runs if the user closes the Google popup or it fails to load
  const handleGoogleError = () => {
    console.log("Google Login Failed");
    alert("Google sign-in was not successful.");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* The Icon at the top of the card */}
        <div className="brand-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>

        {/* Welcome Text */}
        <h1>Chat Assistant Bot</h1>
        <p>Sign in to your account to continue</p>

        {/* The Google Sign-In Button */}
        <div className="google-button-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap         // Shows a small popup for returning users
            shape="pill"      // Makes the button rounded
            theme="outline"   // Makes the button look clean and modern
            size="large"      // Makes it easy to click
            width="100%"      // Makes it fit the card perfectly
          />
        </div>

        {/* Links to Legal Pages */}
        <div className="login-footer">
          By continuing, you agree to our <br />
          <a href="/terms">Terms of Service</a> & <a href="/privacy">Privacy Policy</a>
        </div>

      </div>
    </div>
  );
}

export default Login;