import "../styles/message.css";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// ✅ Added faCheck as fasCheck and faCopy as fasCopy from the SOLID library
import { faVolumeUp, faStop, faCheck as fasCheck, faCopy as fasCopy } from "@fortawesome/free-solid-svg-icons";

function MessageBubble({ message }) {

  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ Mapping for FontAwesome icons using the SOLID prefix to avoid import errors
  const byPrefixAndName = {
    fas: { 
      check: fasCheck,
      copy: fasCopy 
    }
  };

  const text = message.content || message.text || "";
  console.log("messageBubble", text);

  // ✅ Format timestamp (HH:MM AM/PM)
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


  // ✅ Clean markdown for speech only
  const cleanText = (text) => {
    return text
      .replace(/#{1,6}\s?/g, "")
      .replace(/(\*\*|__|\*|_)/g, "")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      //.replace(/\s+/g, " ")
      .trim();
  };
  const handleCopy = async () => {
    try {
      // ✅ FIX: Use cleanText(text) instead of raw text to remove markdown symbols
      const plainText = cleanText(text);
      await navigator.clipboard.writeText(plainText);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // ✅ Text → Speech
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleaned = cleanText(text);

    const utterance = new SpeechSynthesisUtterance(cleaned);

    // 🌍 Language detection (Hindi/Marathi/English)
    const isHindiOrMarathi = /[\u0900-\u097F]/.test(cleaned);

    if (isHindiOrMarathi) {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    // 🎤 Voice selection
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === utterance.lang);

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      console.warn("Voice not available, using default");
    }

    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    setIsSpeaking(true);
  };

  return (
    <div className={`message ${message.role}`}>

      <ReactMarkdown>{text}</ReactMarkdown>

      {/* ✅ Timestamp */}
      <div className="message-time">
        {formatTime(message.created_at)}
        {console.log("RAW TIME:", message.created_at)}
      </div>

      {/* ✅ Actions */}
      {(message.role === "assistant" || message.role === "ai") && (
        <div className="message-actions">

          {/* 🔊 AUDIO BUTTON */}
          <button
            className="audio-btn"
            onClick={handleSpeak}
            type="button"
          >
            <FontAwesomeIcon icon={isSpeaking ? faStop : faVolumeUp} />
          </button>

          {/* 📋 COPY BUTTON */}
          <button
            className="copy-btn"
            onClick={handleCopy}
            type="button"
          >
            {/* ✅ Updated to use fas prefix for both to ensure it works without extra installs */}
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