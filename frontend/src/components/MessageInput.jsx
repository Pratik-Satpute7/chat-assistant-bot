import "../styles/input.css";
import { useState } from "react";
import { sendMessage, createSession } from "../services/api";

function MessageInput({
  session,
  setMessages,
  setActiveSession,
  setSessions,
  renameSession,
  generateSmartTitle,
  setIsTyping
}) {

  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return; // ✅ FIXED

    let currentSession = session;

    // ✅ Create session if not exists
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

    // ✅ START LOADER
    setIsTyping(true);

    try {
      const res = await sendMessage({
        session_id: currentSession.id,
        message: text
      });

      const aiMessage = {
        role: "assistant",
        content: res.answer || res.response,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // ✅ STOP LOADER
      setIsTyping(false);

      // ✅ Smart title
      if (currentSession.title === "New Chat") {
        let newTitle;

        try {
          newTitle = await generateSmartTitle(text);
          if (!newTitle || newTitle.trim() === "") {
            newTitle = text.substring(0, 30);
          }
        } catch {
          newTitle = text.substring(0, 30);
        }

        await renameSession(currentSession.id, newTitle);

        setSessions(prev =>
          prev.map(s =>
            s.id === currentSession.id ? { ...s, title: newTitle } : s
          )
        );

        setActiveSession(prev => ({
          ...prev,
          title: newTitle
        }));
      }

    } catch (error) {
      console.error(error);
      setIsTyping(false); // ✅ important
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

      <button onClick={handleSend} disabled={!text.trim()}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;