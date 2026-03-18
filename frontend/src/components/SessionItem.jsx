import { useState } from "react";
import "../styles/sidebar.css";

function SessionItem({ session, active, onSelect, onRename, onDelete }) {

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
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