import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/auth";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { renameSession, generateSmartTitle } from "../services/api";
import "../styles/chat.css";

function Chat() {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // STATE FOR TYPING INDICATOR
  const [model, setModel] = useState("gemini-2.5-flash"); // ✅ NEW STATE FOR MODEL SELECTION

  useEffect(() => {
    const user = getUser();
    if (!user) navigate("/");
  }, [navigate]);

  return (
    <div className="chat-layout">

      <Sidebar
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        setMessages={setMessages}
        sessions={sessions}
        setSessions={setSessions}
      />

      <div className="chat-section">

        
        <ChatHeader model={model} setModel={setModel} /> {/* ✅ PASS MODEL STATE TO HEADER */}
        <ChatWindow
          session={activeSession}
          messages={messages}
          setMessages={setMessages}
          isTyping={isTyping}   // ✅ PASS
        />

        <MessageInput
          session={activeSession}
          setMessages={setMessages}
          setActiveSession={setActiveSession}
          setSessions={setSessions}
          generateSmartTitle={generateSmartTitle}
          renameSession={renameSession}
          setIsTyping={setIsTyping}  // ✅ PASS
          model={model} // ✅ PASS MODEL TO MESSAGE INPUT
        />

      </div>

    </div>
  );
}

export default Chat;