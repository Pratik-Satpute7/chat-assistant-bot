// It supports:
// 1. Rendering the message text with Markdown formatting
// 2. Showing the timestamp in a readable format
// 3. Copying the message text to clipboard (for AI messages)
// 4. Text-to-speech functionality with language detection (English/Hindi/Marathi)
// 5. Showing action buttons only for AI messages
import "../styles/message.css";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Importing icons for volume, stop, check, and copy from FontAwesome
import { faVolumeUp, faStop, faCheck as fasCheck, faCopy as fasCopy } from "@fortawesome/free-solid-svg-icons";

// It shows the message text, timestamp, and buttons for speaking and copying (for AI messages).
function MessageBubble({ message }) {

  // State to track if text has been copied
  const [copied, setCopied] = useState(false);
  // State to track if text-to-speech is active
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Mapping for FontAwesome icons to avoid import issues
  const byPrefixAndName = {
    fas: {
      check: fasCheck,
      copy: fasCopy
    }
  };

  // Get the message text from the message object
  const text = message.content || message.text || "";
  {/* console.log("messageBubble", text);*/}

  // Function to format the timestamp into a readable time
  const formatTime = (time) => {
    if (!time) return "";

    const date = new Date(time + "Z");

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };


  // Function to clean markdown formatting from text for speech
  const cleanText = (text) => {
    return text
      .replace(/#{1,6}\s?/g, "") // Remove headers
      .replace(/(\*\*|__|\*|_)/g, "") // Remove bold/italic
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // Remove links, keep text
      .replace(/`([^`]+)`/g, "$1") // Remove code blocks
      //.replace(/\s+/g, " ") // Commented out: remove extra spaces
      .trim();
  };
  // Function to copy the message text to clipboard
  const handleCopy = async () => {
    try {
      // Use cleaned text without markdown for copying
      const plainText = cleanText(text);
      await navigator.clipboard.writeText(plainText);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Function to handle text-to-speech
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop speaking if already speaking
      setIsSpeaking(false);
      return;
    }

    const cleaned = cleanText(text); // Clean text for speech

    const utterance = new SpeechSynthesisUtterance(cleaned);

    // Detect if text is in Hindi or Marathi (Devanagari script)
    const isHindiOrMarathi = /[\u0900-\u097F]/.test(cleaned);

    if (isHindiOrMarathi) {
      utterance.lang = "hi-IN"; // Set to Hindi
    } else {
      utterance.lang = "en-IN"; // Set to English
    }

    // Find a matching voice for the language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === utterance.lang);

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      console.warn("Voice not available, using default");
    }

    utterance.onend = () => setIsSpeaking(false); // When speech ends, update state

    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(utterance); // Start speaking

    setIsSpeaking(true);
  };

  return (
    <div className={`message ${message.role}`}>
      {/* Render the message text with markdown support */}
      <ReactMarkdown>{text}</ReactMarkdown>

      {/* Show the timestamp */}
      <div className="message-time">
        {formatTime(message.created_at)}
        {/*console.log("RAW TIME:", message.created_at)*/}
      </div>

      {/* Show action buttons only for AI messages */}
      {(message.role === "assistant" || message.role === "ai") && (
        <div className="message-actions">

          {/* Button to play or stop speech */}
          <button
            className="audio-btn"
            onClick={handleSpeak}
            type="button"
          >
            <FontAwesomeIcon icon={isSpeaking ? faStop : faVolumeUp} />
          </button>

          {/* Button to copy the message */}
          <button
            className="copy-btn"
            onClick={handleCopy}
            type="button"
          >
            {/* Show check icon if copied, else copy tick*/}
            {copied ? (
              <FontAwesomeIcon icon={byPrefixAndName.fas['check']} style={{ color: "#4caf50" }} />
            ) : (
              <FontAwesomeIcon icon={byPrefixAndName.fas['copy']} />
            )}
          </button>

        </div>
      )}

    </div>
  );
}

export default MessageBubble;