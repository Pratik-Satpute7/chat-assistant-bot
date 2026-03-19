import { useNavigate } from "react-router-dom";
import { getUser } from "../services/auth";
import { useState, useRef, useEffect } from "react";
import "../styles/chat.css";

function ChatHeader({ model, setModel }) {

  const navigate = useNavigate();
  const user = getUser();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // ✅ close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const models = [
    { label: "⚡ Flash (Fast)", value: "gemini-2.5-flash" },
    { label: "🧠 Pro (Accurate)", value: "gemini-1.5-pro" },
  ];

  return (
    <div className="chat-header">

      {/* ✅ Custom Dropdown */}
      <div className="dropdown" ref={dropdownRef}>
        
        <div className="dropdown-trigger" onClick={() => setOpen(!open)}>
          {models.find(m => m.value === model)?.label}
          <span className={`arrow ${open ? "open" : ""}`}>⌄</span>
        </div>

        {open && (
          <div className="dropdown-menu">
            {models.map((m) => (
              <div
                key={m.value}
                className={`dropdown-item ${model === m.value ? "active" : ""}`}
                onClick={() => {
                  setModel(m.value);
                  setOpen(false);
                }}
              >
                {m.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Avatar */}
      <img
        className="avatar"
        src={user?.picture}
        alt="user"
        referrerPolicy="no-referrer"
        onClick={() => navigate("/profile")}
      />

    </div>
  );
}

export default ChatHeader;