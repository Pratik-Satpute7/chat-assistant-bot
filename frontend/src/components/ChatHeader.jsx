import { useNavigate } from "react-router-dom";
import { getUser } from "../services/auth";
import "../styles/chat.css";  

function ChatHeader() {

  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="chat-header">

      <div></div>
      <img
      className="avatar"
      src={user?.picture}
      alt="user"
      referrerPolicy="no-referrer"
      onClick={() => navigate("/profile")}
    />

    </div>
  );
}

export default ChatHeader;