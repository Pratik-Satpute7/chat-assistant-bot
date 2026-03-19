import "../styles/input.css";
import { useState } from "react";
import { sendMessage, createSession } from "../services/api";
import useSpeechToText from "../hooks/useSpeechToText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

function MessageInput({
  session,
  setMessages,
  setActiveSession,
  setSessions,
  renameSession,
  generateSmartTitle,
  setIsTyping,
  model  // ✅ ADD THIS
}) {
  const { isListening, startListening, stopListening } = useSpeechToText();
  const handleMicClick = () => {
  if (isListening) {
    stopListening();
  } else {
    startListening((voiceText) => {
      setText((prev) => prev + " " + voiceText);
    });
  }
};
  const [text, setText] = useState("");

  const handleSend = async () => {
  if (!text.trim()) return;

  let currentSession = session;

  if (!currentSession) {
    try {
      const newSession = await createSession("New Chat");
      currentSession = newSession;
      setActiveSession(newSession);
      setSessions(prev => [newSession, ...prev]);
    } catch (err) {
      console.error("Session creation failed", err);
      return;
    }
  }

  const userMessage = {
    role: "user",
    content: text,
    created_at: new Date().toISOString()
  };

  setMessages(prev => [...prev, userMessage]);
  setText("");
  setIsTyping(true); // start loader

  try {
    const res = await sendMessage({
      session_id: currentSession.id,
      message: text,
      model: model
    });

    const aiContent = res.answer || res.response || "AI did not respond. Please try again.";

    const aiMessage = {
      role: "assistant",
      content: aiContent,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false); // stop loader

    // Smart title
    if (currentSession.title === "New Chat") {
      let newTitle;
      try {
        newTitle = await generateSmartTitle(text);
        if (!newTitle || newTitle.trim() === "") newTitle = text.substring(0, 30);
      } catch {
        newTitle = text.substring(0, 30);
      }

      await renameSession(currentSession.id, newTitle);
      setSessions(prev => prev.map(s => s.id === currentSession.id ? { ...s, title: newTitle } : s));
      setActiveSession(prev => ({ ...prev, title: newTitle }));
    }

  } catch (error) {
    console.error(error);
    setIsTyping(false); // important
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
  <textarea
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Ask something..."
  />

  {isListening && <span className="listening-text">Listening...</span>}

  <div className="input-actions">
    
    {/* 🎤 MIC BUTTON */}
      <button 
        onClick={handleMicClick} 
        className={isListening ? "mic-btn active" : "mic-btn"}
    >
      <FontAwesomeIcon icon={faMicrophone} />
    </button>

    {/* SEND BUTTON */}
    <button onClick={handleSend} disabled={!text.trim()}>
      Send
    </button>

  </div>
</div>
  );
}

export default MessageInput;