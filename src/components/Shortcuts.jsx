import { memo } from "react";
import { DEFAULT_SHORTCUTS } from "../constants";

/**
 * Shortcuts component displaying developer quick links.
 * Handles empty state gracefully and uses stable keys.
 *
 * @param {Object} props
 * @param {Array<{id: string, label: string, url: string}>} [props.shortcuts=DEFAULT_SHORTCUTS]
 */
function Shortcuts({ shortcuts = DEFAULT_SHORTCUTS }) {
  if (!Array.isArray(shortcuts) || shortcuts.length === 0) {
    return (
      <nav className="shortcuts shortcuts-empty" aria-label="Developer Shortcuts">
        <span className="shortcuts-empty-text">
          No shortcuts configured. Open settings ⚙ to add shortcuts.
        </span>
      </nav>
    );
  }

  return (
    <nav className="shortcuts" aria-label="Developer Shortcuts">
      {shortcuts.map((shortcut) => (
        <a
          key={shortcut.id || shortcut.label}
          href={shortcut.url}
          target="_blank"
          className="shortcut-btn"
          rel="noreferrer"
        >
          {shortcut.label}
        </a>
      ))}
    </nav>
  );
}

export default memo(Shortcuts);
