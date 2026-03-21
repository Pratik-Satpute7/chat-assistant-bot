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
  const [isTyping, setIsTyping] = useState(false);
  const [model, setModel] = useState("gemini-2.5-flash");

  // ✅ NEW: State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) navigate("/");
  }, [navigate]);

  return (
    /* ✅ Added dynamic class to handle sidebar sliding */
    <div className={`chat-layout ${isSidebarOpen ? "sidebar-mobile-open" : ""}`}>
      
      <Sidebar
        activeSession={activeSession}
        setActiveSession={(session) => {
          setActiveSession(session);
          setIsSidebarOpen(false); // ✅ Auto-close sidebar on mobile after selecting chat
        }}
        setMessages={setMessages}
        sessions={sessions}
        setSessions={setSessions}
      />

      {/* ✅ Overlay to close sidebar when clicking the chat area on mobile */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="chat-section">
        {/* ✅ Pass toggle function to Header */}
        <ChatHeader 
          model={model} 
          setModel={setModel} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <ChatWindow
          session={activeSession}
          messages={messages}
          setMessages={setMessages}
          isTyping={isTyping}
        />

        <MessageInput
          session={activeSession}
          setMessages={setMessages}
          setActiveSession={setActiveSession}
          setSessions={setSessions}
          generateSmartTitle={generateSmartTitle}
          renameSession={renameSession}
          setIsTyping={setIsTyping}
          model={model}
        />
      </div>
    </div>
  );
}

export default Chat;