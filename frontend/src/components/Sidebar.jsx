import { useEffect, useState } from "react";
import SessionItem from "./SessionItem";
import { getUser, logout } from "../services/auth";
// import { createSession, getSessions } from "../services/api";
// import { deleteSession } from "../services/api";
// import { getSessions, deleteSession } from "../services/api";
import { createSession, getSessions, deleteSession,renameSession  } from "../services/api";
import Swal from "sweetalert2"; // for the aleret
import "../styles/sidebar.css";

function Sidebar({ activeSession, setActiveSession,sessions, setSessions }) {
 // const [sessions, setSessions] = useState([]);
 const [showSettings, setShowSettings] = useState(false); // toggle menu
const [darkMode, setDarkMode] = useState(false); // theme toggle

  useEffect(() => {
    loadSessions();
  }, []);

    const user = getUser();

  const loadSessions = async () => {
  try {
    const data = await getSessions();
    if (Array.isArray(data)) {
    //  setSessions(data);
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

  const handleNewChat = async () => {
    try {
      const session = await createSession(); // title defaults to "New Chat"
      setSessions((prev) => [session, ...prev]);
      setActiveSession(session);
    } catch (error) {
      console.error("Failed to create session", error);
    }
  };
  // for remove the sessions
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

// Toggle dark mode
const handleToggleTheme = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);

  document.body.classList.toggle("dark-mode", newMode);
};

// Logout
const handleLogout = () => {
  logout();
  window.location.href = "/";
};
  return (
    <div className="sidebar">
      <button className="new-chat" onClick={handleNewChat}>
        + New Chat
      </button>

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
      {/* ✅ Sidebar Footer */}
<div className="sidebar-footer">

  {/* User Info Row */}
  <div 
    className="user-info" 
    onClick={() => setShowSettings(!showSettings)}
  >
    <div className="user-name">
      {user?.name || "User"}
    </div>
    <div className="settings-icon">⚙️</div>
  </div>

  {/* Settings Dropdown */}
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