import { memo } from "react";

/**
 * SearchBar component for performing Google searches.
 * Features:
 * - Glassmorphic pill wrapper with search icon
 * - Subtle keyboard return indicator (↵)
 * - Focused highlight glow
 */
function SearchBar() {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
    }
  };

  return (
    <div className="search-box">
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>

        <input
          type="search"
          placeholder="Search Google..."
          aria-label="Search Google"
          autoComplete="off"
          spellCheck="false"
          onKeyDown={handleKeyDown}
        />

        <kbd className="search-kbd" title="Press Enter to search" aria-hidden="true">
          ↵
        </kbd>
      </div>
    </div>
  );
}

export default memo(SearchBar);
