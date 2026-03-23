// 1. AI model selection dropdown
// 2. Mobile menu toggle button (for responsive design)
// 3. User avatar with navigation to profile
// 4. Handles outside clicks to close dropdown menus
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/auth";
import { useState, useRef, useEffect } from "react";
import "../styles/chat.css";

function ChatHeader({ model, setModel, onToggleSidebar }) {

  const navigate = useNavigate();
  const user = getUser();

  // State to control if the dropdown is open
  const [open, setOpen] = useState(false);
  // Reference to the dropdown element for detecting outside clicks
  const dropdownRef = useRef();

  // Effect to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // List of available AI models with labels and values
  const models = [
    { label: "⚡ Flash (Fast)", value: "gemini-2.5-flash" },
    { label: "🧠 gemini-2.0-flash", value: "gemini-2.0-flash" },
    { label: "⚡ gemini-flash-latest", value: "gemini-flash-latest" },
    { label: "🧠 gemini-2.5-flash-lite", value: "gemini-2.5-flash-lite" },
    { label: "⚡ gemini-flash-lite-latest", value: "gemini-flash-lite-latest" }
  ];

  return (
    <div className="chat-header">
      
      {/* Button to toggle the sidebar on mobile devices */}
      <button className="mobile-menu-btn" onClick={onToggleSidebar}>
        ☰
      </button>

      {/* Custom dropdown for selecting AI model */}
      <div className="dropdown" ref={dropdownRef}>
        
        {/* Trigger button for the dropdown */}
        <div className="dropdown-trigger" onClick={() => setOpen(!open)}>
          {models.find(m => m.value === model)?.label}
          <span className={`arrow ${open ? "open" : ""}`}>⌄</span>
        </div>

        {/* Dropdown menu with model options */}
        {open && (
          <div className="dropdown-menu">
            {models.map((m) => (
              <div
                key={m.value}
                className={`dropdown-item ${model === m.value ? "active" : ""}`}
                onClick={() => {
                  setModel(m.value);// select new model
                  setOpen(false);// close dropdown
                }}
              >
                {m.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User avatar that navigates to profile page */}
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