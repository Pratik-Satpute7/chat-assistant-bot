import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/auth";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { renameSession, generateSmartTitle } from "../services/api";
import "../styles/chat.css";

// Main chat page component that brings together all chat-related UI elements.
// It manages the active session, messages, sessions list, and handles mobile sidebar.
function Chat() {
  const navigate = useNavigate();

  // Currently selected chat session
  const [activeSession, setActiveSession] = useState(null);
  // List of messages in the current session
  const [messages, setMessages] = useState([]);
  // All available chat sessions
  const [sessions, setSessions] = useState([]);
  // Shows typing indicator when AI is responding
  const [isTyping, setIsTyping] = useState(false);
  // Selected AI model for responses
  const [model, setModel] = useState("gemini-2.5-flash");

  // State to control sidebar visibility on mobile devices
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if user is logged in, redirect to login if not
  useEffect(() => {
    const user = getUser();
    if (!user) navigate("/");
  }, [navigate]);

  return (
    // Main layout container with dynamic class for mobile sidebar
    <div className={`chat-layout ${isSidebarOpen ? "sidebar-mobile-open" : ""}`}>
      
      {/* Sidebar component for session management */}
      <Sidebar
        activeSession={activeSession}
        setActiveSession={(session) => {
          setActiveSession(session);
          setIsSidebarOpen(false); // Close sidebar on mobile after selection
        }}
        setMessages={setMessages}
        sessions={sessions}
        setSessions={setSessions}
      />

      {/* Overlay to close sidebar when clicking outside on mobile */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main chat area */}
      <div className="chat-section">
        {/* Header with model selector and mobile menu toggle */}
        <ChatHeader 
          model={model} 
          setModel={setModel} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* Chat messages display */}
        <ChatWindow
          session={activeSession}
          messages={messages}
          setMessages={setMessages}
          isTyping={isTyping}
        />

        {/* Input area for sending messages */}
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