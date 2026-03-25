// This component handles the user input area in the chat interface. It supports:
// 1. Text input with auto-resizing based on content
// 2. Speech-to-text input via microphone
// 3. Sending messages to AI backend
// 4. Creating new chat sessions if none exist
// 5. Smart title generation for new sessions
// 6. Typing indicator management
// ----------------------------------------------------------------------------------
import "../styles/input.css";
import { useState, useRef, useEffect } from "react";
import { sendMessage, createSession,generateSmartTitle,renameSession } from "../services/api";
import useSpeechToText from "../hooks/useSpeechToText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

function MessageInput({
  session, // Current chat session
  setMessages, // Function to update the list of messages
  setActiveSession, // Function to set the active session
  setSessions, // Function to update the list of sessions
  renameSession, // Function to rename a session
  generateSmartTitle, // Function to generate a smart title for the session
  setIsTyping, // Function to show/hide typing indicator
  model  // AI model to use for responses
}) {
  // Reference to the textarea for resizing
  const textareaRef = useRef(null);
  // Hook for speech-to-text functionality
  const { isListening, startListening, stopListening } = useSpeechToText();
  // Function to handle microphone button clicks
  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((voiceText) => {
        setText((prev) => prev + " " + voiceText);
      });
    }
  };
  // State to hold the text input
  const [text, setText] = useState("");

  // Function to handle sending a message
  const handleSend = async () => {
    if (!text.trim()) return; // Don't send empty messages

    let currentSession = session;

    // If no session exists, create a new one
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

    // Create user message object
    const userMessage = {
      role: "user",
      content: text,
      created_at: new Date().toISOString()
    };

    // Add user message to the chat
    setMessages(prev => [...prev, userMessage]);
    setText(""); // Clear the input
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "15px"; // reset to min-height
    }
    setIsTyping(true); // Show typing indicator

    try {
      // Send message to backend
      const res = await sendMessage({
        session_id: currentSession.id,
        message: text,
        model: model
      });

      // Get AI response
      const aiContent = res.answer || res.response || "AI did not respond. Please try again.";

      // Create AI message object
      const aiMessage = {
        role: "assistant",
        content: aiContent,
        created_at: new Date().toISOString()
      };

      // Add AI message to the chat
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false); // Hide typing indicator

      // Auto-generate smart title if it's a new session
if (currentSession.title === "New Chat") {
  let newTitle;

  try {
    //  Call backend API
    const title = await generateSmartTitle(text);

    console.log("SMART TITLE:", title);

    // Assign properly
    newTitle = title;

    // fallback safety
    if (!newTitle || newTitle.trim() === "") {
      newTitle = "New Chat.";
    }

  } catch (err) {
    console.error("Smart title error:", err);
    newTitle = "New Chat";
  }

  // Rename in backend
  await renameSession(currentSession.id, newTitle);

  //  Update UI
  setSessions(prev =>
    prev.map(s =>
      s.id === currentSession.id ? { ...s, title: newTitle } : s
    )
  );

  //  Update active session
  setActiveSession(prev => ({ ...prev, title: newTitle }));
}

    } catch (error) {
      console.error(error);
      setIsTyping(false); // Hide typing indicator on error
    }
  };

  // Function to handle key presses in the textarea
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(); // Send message on Enter
    }
  };
  // Effect to auto-resize the textarea based on content
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [text]); // Runs when text changes

  return (
    <div className="input-area">
      {/* Textarea for user input */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask something..."
      />

      {/* Show listening indicator when voice input is active */}
      {isListening && <span className="listening-text">Listening...</span>}

      <div className="input-actions">
        {/* Microphone button for voice input */}
        <button
          onClick={handleMicClick}
          className={isListening ? "mic-btn active" : "mic-btn"}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </button>

        {/* Send button */}
        <button onClick={handleSend} disabled={!text.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;