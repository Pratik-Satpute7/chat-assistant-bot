// It handles:
// 1. Displaying the session title
// 2. Highlighting the active session
// 3. Handling selection of a session
// 4. Showing a dropdown menu with options to rename or delete
// 5. Closing the dropdown when clicking outside
// ---------------------------------------------
import { useState, useEffect, useRef } from "react";
import "../styles/sidebar.css";

// It supports selecting, rename/delete options, and outside click to close menu.
function SessionItem({ session, active, onSelect, onRename, onDelete }) {

  const [showMenu, setShowMenu] = useState(false); // show/hide the action menu

  // Ref to the session item DOM node (for outside-click detection)
  const menuRef = useRef(null);

  // Close the dropdown menu when user clicks outside this item
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

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

      {/* Three-dot menu trigger */}
      <div
        className="session-menu"
        onClick={(e) => {
          e.stopPropagation(); // prevent selecting session when opening menu
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