import { useState, useEffect, useRef } from "react";
import "../styles/sidebar.css";

function SessionItem({ session, active, onSelect, onRename, onDelete }) {

  const [showMenu, setShowMenu] = useState(false);

  // 🔹 Ref to track this component
  const menuRef = useRef(null);

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {

      // If click is outside this component → close menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener
    document.addEventListener("click", handleClickOutside);

    // Cleanup (important to avoid memory leaks)
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}  // 🔹 Attach ref here
      className={`session-item ${active ? "active" : ""}`}
      onClick={() => onSelect(session)}
    >

      <span className="session-title">
        {session.title}
      </span>

      <div
        className="session-menu"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
      >
        ⋮
      </div>

      {showMenu && (
        <div className="session-dropdown">

          <div
            onClick={(e) => {
              e.stopPropagation();
              onRename(session);
              setShowMenu(false);
            }}
          >
            Rename
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onDelete(session);
              setShowMenu(false);
            }}
          >
            Delete
          </div>

        </div>
      )}

    </div>
  );
}

export default SessionItem;