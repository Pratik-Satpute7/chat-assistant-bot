// 1. Loading messages for the current session from the backend
// 2. Rendering each message using MessageBubble component
// 3. Showing a typing indicator for the AI
// 4. Auto-scrolling to the latest message
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { getMessages } from "../services/api";

// It loads messages when session changes and scrolls to bottom for new messages.
function ChatWindow({ session, messages, setMessages, isTyping }) {

  const bottomRef = useRef(null); // Marker to scroll to bottom

  // Load messages when the session changes
  useEffect(() => {
    if (!session) return;

    const loadMessages = async () => {
      const data = await getMessages(session.id);
      setMessages(data);   // only runs when session changes
    };

    loadMessages();

  }, [session]);   // only depend on session

  // Scroll down when new messages arrive or typing indicator changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat-messages">

      {/* Render each message bubble */}
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}

      {isTyping && (
        <div className="message assistant typing">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}

      {/* Invisible element at end of chat for auto-scroll */}
      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatWindow;