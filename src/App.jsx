import { useState, useEffect, useCallback } from "react";
import TopBar from "./components/TopBar";
import MainClock from "./components/MainClock";
import WorldClocks from "./components/WorldClocks";
import SearchBar from "./components/SearchBar";
import Shortcuts from "./components/Shortcuts";
import SettingsPanel from "./components/SettingsPanel";
import ToolboxModal from "./components/Toolbox/ToolboxModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  DEFAULT_CLOCKS,
  DEFAULT_SHORTCUTS,
  STATIC_BACKGROUNDS
} from "./constants";
import { sanitizeSavedShortcuts } from "./utils/url";

/**
 * Calculates the initial background index safely according to the active mode.
 * Ensures no cascading effects or infinite loops occur.
 *
 * @param {string} mode - Background mode ("manual" | "daily" | "random").
 * @param {number} totalImages - Total number of static background images.
 * @returns {number} Selected background index.
 */
function getInitialBgIndex(mode, totalImages) {
  if (!totalImages) return 0;

  try {
    if (mode === "random") {
      return Math.floor(Math.random() * totalImages);
    }

    if (mode === "daily") {
      const today = new Date().toDateString();
      const savedDay = localStorage.getItem("bgDay");
      const savedIdx = Number(localStorage.getItem("bgIndex")) || 0;

      if (savedDay !== today) {
        const next = (savedIdx + 1) % totalImages;
        try {
          localStorage.setItem("bgDay", today);
          localStorage.setItem("bgIndex", String(next));
        } catch (e) {
          console.warn("Could not save daily background advancement:", e);
        }
        return next;
      }
      return savedIdx >= 0 && savedIdx < totalImages ? savedIdx : 0;
    }

    const saved = localStorage.getItem("bgIndex");
    const idx = saved !== null ? Number(saved) : 0;
    return !Number.isNaN(idx) && idx >= 0 && idx < totalImages ? idx : 0;
  } catch (error) {
    console.warn("Failed to determine initial background index:", error);
    return 0;
  }
}

export default function App() {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const [clocks, setClocks] = useLocalStorage("clocks", DEFAULT_CLOCKS);
  const [shortcuts, setShortcuts] = useLocalStorage("shortcuts", () => {
    const saved = localStorage.getItem("shortcuts");
    if (!saved) return DEFAULT_SHORTCUTS;
    try {
      return sanitizeSavedShortcuts(JSON.parse(saved));
    } catch {
      return DEFAULT_SHORTCUTS;
    }
  });

  const [bgMode, setBgMode] = useLocalStorage("bgMode", "manual");
  const [bgIndex, setBgIndex] = useLocalStorage("bgIndex", () =>
    getInitialBgIndex(localStorage.getItem("bgMode") || "manual", STATIC_BACKGROUNDS.length)
  );

  const [now, setNow] = useState(() => new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showToolbox, setShowToolbox] = useState(false);

  /* ================= 1-SECOND TIMER ================= */
  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  /* ================= STABLE HANDLERS ================= */
  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const handleToggleSettings = useCallback(() => {
    setShowSettings((prev) => {
      if (!prev) setShowToolbox(false);
      return !prev;
    });
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleToggleToolbox = useCallback(() => {
    setShowToolbox((prev) => {
      if (!prev) setShowSettings(false);
      return !prev;
    });
  }, []);

  const handleCloseToolbox = useCallback(() => {
    setShowToolbox(false);
  }, []);

  const handleClockChange = useCallback((id, field, value) => {
    setClocks((prevClocks) => {
      if (!Array.isArray(prevClocks)) return DEFAULT_CLOCKS;
      return prevClocks.map((clock) =>
        clock.id === id ? { ...clock, [field]: value } : clock
      );
    });
  }, [setClocks]);

  /* ================= SHORTCUT HANDLERS ================= */
  const handleAddShortcut = useCallback((newShortcut) => {
    setShortcuts((prev) => {
      const list = Array.isArray(prev) ? prev : DEFAULT_SHORTCUTS;
      return [...list, newShortcut];
    });
  }, [setShortcuts]);

  const handleUpdateShortcut = useCallback((id, updated) => {
    setShortcuts((prev) => {
      if (!Array.isArray(prev)) return DEFAULT_SHORTCUTS;
      return prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
    });
  }, [setShortcuts]);

  const handleDeleteShortcut = useCallback((id) => {
    setShortcuts((prev) => {
      if (!Array.isArray(prev)) return DEFAULT_SHORTCUTS;
      return prev.filter((s) => s.id !== id);
    });
  }, [setShortcuts]);

  const handleReorderShortcuts = useCallback((fromIndex, toIndex) => {
    setShortcuts((prev) => {
      if (!Array.isArray(prev)) return DEFAULT_SHORTCUTS;
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length
      ) {
        return prev;
      }
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, [setShortcuts]);

  const handleResetShortcuts = useCallback(() => {
    setShortcuts(DEFAULT_SHORTCUTS);
  }, [setShortcuts]);

  /* ================= BACKGROUND HANDLERS ================= */
  const handleBgModeChange = useCallback((newMode) => {
    setBgMode(newMode);

    if (newMode === "random") {
      setBgIndex(Math.floor(Math.random() * STATIC_BACKGROUNDS.length));
    } else if (newMode === "daily") {
      const today = new Date().toDateString();
      const savedDay = localStorage.getItem("bgDay");
      if (savedDay !== today) {
        setBgIndex((prev) => {
          const next = (Number(prev) + 1) % STATIC_BACKGROUNDS.length;
          try {
            localStorage.setItem("bgDay", today);
          } catch {
            // ignore storage errors
          }
          return next;
        });
      }
    }
  }, [setBgMode, setBgIndex]);

  const handleBgIndexChange = useCallback((newIndex) => {
    const safeIndex = Number(newIndex);
    if (!Number.isNaN(safeIndex) && safeIndex >= 0 && safeIndex < STATIC_BACKGROUNDS.length) {
      setBgIndex(safeIndex);
    }
  }, [setBgIndex]);

  // Guaranteed valid background asset
  const safeBgIndex =
    typeof bgIndex === "number" && bgIndex >= 0 && bgIndex < STATIC_BACKGROUNDS.length
      ? bgIndex
      : 0;
  const activeBg = STATIC_BACKGROUNDS[safeBgIndex] || STATIC_BACKGROUNDS[0];

  return (
    <div
      className={`app app-${theme}`}
      style={{
        backgroundImage: `url(${activeBg})`
      }}
    >
      <div className="overlay" />

      <main className="content">
        {/* Top bar with greeting, theme switch, toolbox trigger, settings button */}
        <TopBar
          theme={theme}
          isSettingsOpen={showSettings}
          isToolboxOpen={showToolbox}
          onToggleTheme={handleToggleTheme}
          onToggleSettings={handleToggleSettings}
          onToggleToolbox={handleToggleToolbox}
        />

        {/* Central main digital clock */}
        <MainClock now={now} />

        {/* Configurable world clocks */}
        <WorldClocks clocks={clocks} now={now} />

        {/* Google search */}
        <SearchBar />

        {/* Developer quick links */}
        <Shortcuts shortcuts={shortcuts} />

        {/* Credit attribution */}
        <div className="credit">Clicked By @silentvibeslens</div>
      </main>

      {/* Developer Toolbox Modal */}
      <ToolboxModal
        isOpen={showToolbox}
        onClose={handleCloseToolbox}
      />

      {/* Settings drawer with backdrop click-outside */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={handleCloseSettings}
        clocks={clocks}
        onClockChange={handleClockChange}
        shortcuts={shortcuts}
        onAddShortcut={handleAddShortcut}
        onUpdateShortcut={handleUpdateShortcut}
        onDeleteShortcut={handleDeleteShortcut}
        onReorderShortcuts={handleReorderShortcuts}
        onResetShortcuts={handleResetShortcuts}
        bgMode={bgMode}
        onBgModeChange={handleBgModeChange}
        bgIndex={safeBgIndex}
        onBgIndexChange={handleBgIndexChange}
      />
    </div>
  );
}
