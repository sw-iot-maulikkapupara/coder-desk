import { memo } from "react";

/**
 * TopBar component containing greeting title, theme toggle, toolbox trigger, and settings button.
 * Memoized to avoid re-rendering on 1-second clock ticks.
 *
 * @param {Object} props
 * @param {"dark" | "light"} props.theme - Current active theme.
 * @param {boolean} [props.isSettingsOpen=false] - Whether settings panel is open.
 * @param {boolean} [props.isToolboxOpen=false] - Whether developer toolbox is open.
 * @param {() => void} props.onToggleTheme - Callback to toggle between light and dark themes.
 * @param {() => void} props.onToggleSettings - Callback to toggle settings panel visibility.
 * @param {() => void} props.onToggleToolbox - Callback to toggle toolbox modal visibility.
 */
function TopBar({
  theme,
  isSettingsOpen = false,
  isToolboxOpen = false,
  onToggleTheme,
  onToggleSettings,
  onToggleToolbox
}) {
  const isDark = theme === "dark";

  return (
    <header className="top-bar">
      <div className="greeting">Coder Desk</div>

      <div>
        {/* Theme toggle */}
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          {isDark ? "🌙" : "☀️"}
        </button>

        {/* Developer Toolbox trigger */}
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleToolbox}
          style={{ marginLeft: 10 }}
          aria-label={isToolboxOpen ? "Close Developer Toolbox" : "Open Developer Toolbox"}
          title="Developer Toolbox (JSON, JWT, URL)"
          aria-expanded={isToolboxOpen}
        >
          🧰
        </button>

        {/* Settings trigger */}
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleSettings}
          style={{ marginLeft: 10 }}
          aria-label={isSettingsOpen ? "Close settings" : "Open settings"}
          title={isSettingsOpen ? "Close settings" : "Open settings"}
          aria-expanded={isSettingsOpen}
        >
          ⚙
        </button>
      </div>
    </header>
  );
}

export default memo(TopBar);
