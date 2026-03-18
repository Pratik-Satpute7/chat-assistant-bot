import "../styles/message.css";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

function MessageBubble({ message }) {

  const [copied, setCopied] = useState(false);

  const text = message.content || message.text || "";
  console.log("messageBubble",text);
  
  
  // ✅ Format timestamp (HH:MM AM/PM)
  const formatTime = (time) => {
    if (!time) return ""; // safety check

    
  const date = new Date(time + "Z"); // force UTC parsing

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
        hour12: true,
    timeZone: "Asia/Kolkata" ,
    });
    
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);   // ✅ safe async
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);  // ✅ prevents crash
    }
  };

  return (
    <div className={`message ${message.role}`}>

      <ReactMarkdown>{text}</ReactMarkdown>

       {/* ✅ Timestamp display */}
      <div className="message-time">
        {formatTime(message.created_at)}
        {console.log("RAW TIME:", message.created_at)}
      </div>

      {/* ✅ support BOTH ai + assistant */}
      {(message.role === "assistant" || message.role === "ai") && (
        <button
          className="copy-btn"
          onClick={handleCopy}
          type="button"   /* ✅ VERY IMPORTANT */
        >
          {copied ? "✔" : "📋"}
        </button>
      )}

    </div>
  );
}

export default MessageBubble;