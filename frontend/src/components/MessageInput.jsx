import "../styles/input.css";
import { useState, useRef, useEffect } from "react";
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
  const textareaRef = useRef(null); // ✅ ADD THIS (MISSING)
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
  // ✅ RESET TEXTAREA HEIGHT AFTER SEND
if (textareaRef.current) {
  textareaRef.current.style.height = "15px";// reset to min-height
}
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

    // auto Smart title edge case: only if it's a new session with default title
    if (currentSession.title === "New Chat") {
  let newTitle;

  try {
    const res = await generateSmartTitle(text);
console.log("SMART TITLE RESPONSE:", res); // 🔥 ADD THIS
    // 🔹 Extract title correctly from backend response
    // newTitle = res?.title;
      newTitle = res;
    // 🔹 Final safety fallback
    if (!newTitle || newTitle.trim() === "") {
      newTitle = "New Chat";
    }

  } catch {
    newTitle = "New Chat";
  }

  await renameSession(currentSession.id, newTitle);

  setSessions(prev =>
    prev.map(s =>
      s.id === currentSession.id ? { ...s, title: newTitle } : s
    )
  );

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
  // ✅ AUTO RESIZE TEXTAREA (SAFE WAY)
useEffect(() => {
  const el = textareaRef.current;
  if (el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }
}, [text]);

  return (
    <div className="input-area">
  <textarea
    ref={textareaRef} // ✅ ADD THIS
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