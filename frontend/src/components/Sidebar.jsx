import { useEffect, useState, useRef } from "react";
import SessionItem from "./SessionItem";
import { getUser, logout } from "../services/auth";
import { createSession, getSessions, deleteSession, renameSession } from "../services/api";
import Swal from "sweetalert2";
import "../styles/sidebar.css";

function Sidebar({ activeSession, setActiveSession, sessions, setSessions }) {

  const [showSettings, setShowSettings] = useState(false); // toggle menu
  const [darkMode, setDarkMode] = useState(false); // theme toggle

  // 🔹 Ref to track footer (user + dropdown area)
  const settingsRef = useRef(null);

  // 🔹 Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // 🔹 Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {

      // If clicked outside footer → close dropdown
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup to avoid memory leak
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const user = getUser();

  // 🔹 Fetch sessions from backend
  const loadSessions = async () => {
    try {
      const data = await getSessions();
      if (Array.isArray(data)) {
        // Sort latest first
        setSessions(
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
      } else {
        console.error("Unexpected response", data);
      }
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  };

  // 🔹 Create new chat
  const handleNewChat = async () => {
    try {
      const session = await createSession();
      setSessions((prev) => [session, ...prev]);
      setActiveSession(session);
    } catch (error) {
      console.error("Failed to create session", error);
    }
  };

  // 🔹 Delete session
  const handleDeleteSession = async (session) => {
    const result = await Swal.fire({
      title: "Delete Chat?",
      text: "This chat will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it"
    });

    if (result.isConfirmed) {
      try {
        await deleteSession(session.id);

        setSessions(prev => prev.filter(s => s.id !== session.id));

        if (activeSession?.id === session.id) {
          setActiveSession(null);
        }

        Swal.fire({
          title: "Deleted!",
          text: "Chat session removed successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete session.",
          icon: "error"
        });
      }
    }
  };

  // 🔹 Rename session
  const handleRenameSession = async (session) => {

    const { value: newTitle } = await Swal.fire({
      title: "Rename Chat",
      input: "text",
      inputValue: session.title,
      showCancelButton: true,
      confirmButtonText: "Rename"
    });

    if (!newTitle || newTitle === session.title) return;

    try {
      await renameSession(session.id, newTitle);

      setSessions(prev =>
        prev.map(s =>
          s.id === session.id ? { ...s, title: newTitle } : s
        )
      );

      Swal.fire({
        icon: "success",
        title: "Renamed!",
        timer: 1200,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Rename Failed"
      });
    }
  };

  // 🔹 Toggle dark mode
  const handleToggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    document.body.classList.toggle("dark-mode", newMode);
  };

  // 🔹 Logout
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="sidebar">

      {/* 🔹 New Chat Button */}
      <button className="new-chat" onClick={handleNewChat}>
        + New Chat
      </button>

      {/* 🔹 Session List */}
      <div className="sessions">
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            active={activeSession?.id === session.id}
            onSelect={setActiveSession}
            onDelete={handleDeleteSession}
            onRename={handleRenameSession}
          />
        ))}
      </div>

      {/* 🔹 Sidebar Footer (User + Settings) */}
      <div className="sidebar-footer" ref={settingsRef}>

        {/* 🔹 User Info Row (toggle dropdown) */}
        <div
          className="user-info"
          onClick={() => setShowSettings(!showSettings)}
        >
          <div className="user-name">
            {user?.name || "User"}
          </div>
          <div className="settings-icon">⚙️</div>
        </div>

        {/* 🔹 Settings Dropdown */}
        {showSettings && (
          <div className="settings-menu">

            {/* Theme Toggle */}
            <div
              className="setting-item"
              onClick={handleToggleTheme}
            >
              Switch to {darkMode ? "Light" : "Dark"} Mode
            </div>

            {/* Logout */}
            <div
              className="setting-item logout"
              onClick={handleLogout}
            >
              Logout
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Sidebar;