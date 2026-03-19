import "../styles/message.css";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faStop } from "@fortawesome/free-solid-svg-icons";

function MessageBubble({ message }) {

  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // ✅ Clean markdown for speech only
  const cleanText = (text) => {
    return text
      .replace(/#{1,6}\s?/g, "")
      .replace(/(\*\*|__|\*|_)/g, "")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
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
            {copied ? "✔" : "📋"}
          </button>

        </div>
      )}

    </div>
  );
}

export default MessageBubble;