// Displays the user's profile page with:
// 1. Profile picture, name, and email
// 2. Navigation button back to home/chat
// 3. Logout functionality
import "../styles/profile.css";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/auth";

// Profile page component that displays the current user's information.
// Users can view their profile picture, name, email, and logout from here.
function Profile() {

  // Hook for navigation between pages
  const navigate = useNavigate();
  // Get the current logged-in user data
  const user = getUser();

  // Function to handle user logout
  const handleLogout = () => {
    logout();  // Clear user data and tokens
    navigate("/");  // Redirect to login page
  };

  return (
    // Main container for the profile page
    <div className="profile-page">

      {/* Button to go back to the chat page */}
      <button className="home-btn" onClick={() => navigate("/chat")}>
        <FontAwesomeIcon icon={faHouse} /> Home
      </button>

      {/* User's profile picture */}
      <img
        src={user?.picture || "https://i.pravatar.cc/120"}  // Fallback avatar if no picture
        alt="profile"
      />

      {/* User's name */}
      <h2>{user?.name}</h2>

      {/* User's email */}
      <p>{user?.email}</p>

      {/* Logout button */}
      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Profile;