import { memo, useEffect } from "react";
import BackgroundGallery from "./BackgroundGallery";
import ShortcutSettings from "./ShortcutSettings";
import {
  TIMEZONE_OPTIONS,
  BACKGROUND_MODES,
  STATIC_BACKGROUNDS
} from "../constants";

/**
 * SettingsPanel component for configuring clocks, shortcuts, and backgrounds.
 * Features:
 * - Dedicated header with close (✕) button
 * - Modern toggle switches for clock visibility
 * - Clean section layout with dividers
 * - Keyboard navigation (Esc to dismiss)
 * - Click-outside backdrop dismissal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the drawer is visible.
 * @param {() => void} props.onClose - Callback to close the settings panel.
 * @param {Array<Object>} props.clocks - Configured clocks array.
 * @param {(clockId: number, field: string, value: any) => void} props.onClockChange - Immutable clock update handler.
 * @param {Array<Object>} props.shortcuts - User configurable shortcuts.
 * @param {(shortcut: Object) => void} props.onAddShortcut - Add shortcut callback.
 * @param {(id: string, updated: Object) => void} props.onUpdateShortcut - Update shortcut callback.
 * @param {(id: string) => void} props.onDeleteShortcut - Delete shortcut callback.
 * @param {(fromIdx: number, toIdx: number) => void} props.onReorderShortcuts - Reorder shortcuts callback.
 * @param {() => void} props.onResetShortcuts - Reset shortcuts callback.
 * @param {string} props.bgMode - Background mode ("manual" | "daily" | "random").
 * @param {(mode: string) => void} props.onBgModeChange - Handler when background mode changes.
 * @param {number} props.bgIndex - Selected background index.
 * @param {(index: number) => void} props.onBgIndexChange - Handler when background image is clicked.
 */
function SettingsPanel({
  isOpen,
  onClose,
  clocks,
  onClockChange,
  shortcuts,
  onAddShortcut,
  onUpdateShortcut,
  onDeleteShortcut,
  onReorderShortcuts,
  onResetShortcuts,
  bgMode,
  onBgModeChange,
  bgIndex,
  onBgIndexChange
}) {
  // Listen for Escape key to close drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Click-outside backdrop */}
      <div
        className="settings-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="settings-header">
          <h3>Settings</h3>
          <button
            type="button"
            className="settings-header-close-btn"
            onClick={onClose}
            aria-label="Close settings"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* ===== CLOCK SETTINGS ===== */}
        <section className="settings-section">
          <h4>World Clocks</h4>
          <div className="clock-settings-list">
            {Array.isArray(clocks) &&
              clocks.map((clock) => (
                <div key={clock.id} className="setting-row">
                  <input
                    value={clock.label}
                    aria-label={`Clock label for ${clock.label}`}
                    placeholder="City / Region"
                    onChange={(e) => onClockChange(clock.id, "label", e.target.value)}
                  />

                  <select
                    value={clock.zone}
                    aria-label={`Timezone for ${clock.label}`}
                    onChange={(e) => onClockChange(clock.id, "zone", e.target.value)}
                  >
                    {TIMEZONE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={clock.format}
                    aria-label={`Time format for ${clock.label}`}
                    onChange={(e) => onClockChange(clock.id, "format", e.target.value)}
                  >
                    <option value="12">12h</option>
                    <option value="24">24h</option>
                  </select>

                  <label
                    className="toggle-switch"
                    title={`Toggle ${clock.label} clock`}
                  >
                    <input
                      type="checkbox"
                      checked={clock.enabled}
                      aria-label={`Enable ${clock.label} clock`}
                      onChange={(e) => onClockChange(clock.id, "enabled", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
          </div>
        </section>

        {/* ===== SHORTCUTS SETTINGS ===== */}
        <section className="settings-section">
          <ShortcutSettings
            shortcuts={shortcuts}
            onAdd={onAddShortcut}
            onUpdate={onUpdateShortcut}
            onDelete={onDeleteShortcut}
            onReorder={onReorderShortcuts}
            onReset={onResetShortcuts}
          />
        </section>

        {/* ===== BACKGROUND SETTINGS (STATIC ONLY) ===== */}
        <section className="settings-section">
          <h4>Background Wallpaper</h4>

          <div className="bg-mode-selector">
            <select
              value={bgMode}
              aria-label="Background rotation mode"
              onChange={(e) => onBgModeChange(e.target.value)}
              className="bg-select"
            >
              {BACKGROUND_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          {/* Static image gallery for manual mode */}
          {bgMode === "manual" && (
            <BackgroundGallery
              backgrounds={STATIC_BACKGROUNDS}
              activeIndex={bgIndex}
              onSelect={onBgIndexChange}
            />
          )}
        </section>

        <button
          type="button"
          className="settings-close-btn"
          onClick={onClose}
          aria-label="Close settings panel"
        >
          Done
        </button>
      </aside>
    </>
  );
}

export default memo(SettingsPanel);
