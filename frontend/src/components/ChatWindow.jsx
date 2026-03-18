import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { getMessages } from "../services/api";

function ChatWindow({ session, messages, setMessages, isTyping }) {

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!session) return;

    const loadMessages = async () => {
      const data = await getMessages(session.id);
      setMessages(data);   // ✅ only runs when session changes
    };

    loadMessages();

  }, [session]);   // ✅ ONLY session (no messages, no clearing)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="chat-messages">

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

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatWindow;