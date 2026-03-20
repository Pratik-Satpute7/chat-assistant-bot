import "../styles/profile.css";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/auth";

function Profile() {

  const navigate = useNavigate(); // ✅ inside component
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-page">

      <button className="home-btn" onClick={() => navigate("/chat")}>
        <FontAwesomeIcon icon={faHouse} /> Home
      </button>

      <img
        src={user?.picture || "https://i.pravatar.cc/120"}
        alt="profile"
      />

      <h2>{user?.name}</h2>

      <p>{user?.email}</p>

      <button onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Profile;