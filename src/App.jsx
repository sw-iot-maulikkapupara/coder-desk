import { useEffect, useState } from "react";

/* ================= CLOCK DATA ================= */

const defaultClocks = [
  { id: 1, label: "India", zone: "Asia/Kolkata", format: "12", enabled: true },
  { id: 2, label: "UTC", zone: "UTC", format: "24", enabled: true },
  { id: 3, label: "USA", zone: "America/New_York", format: "12", enabled: true },
  { id: 4, label: "Extra", zone: "Europe/London", format: "24", enabled: false }
];

/* ================= SHORTCUTS ================= */

const shortcuts = [
  { label: "GitHub", url: "https://github.com" },
  { label: "Gmail", url: "https://mail.google.com" },
  { label: "ChatGPT", url: "https://chat.openai.com" },
  { label: "Calendar", url: "https://calendar.google.com" },
  { label: "StackOverflow", url: "https://stackoverflow.com" },
  { label: "Outlook", url: "https://outlook.live.com" },
  { label: "AI Tools", url: "https://www.futuretools.io" }
];

/* ================= STATIC BACKGROUNDS (YOUR IMAGES) ================= */

const staticBackgrounds = [
  "/default-bg/1.jpg",
  "/default-bg/2.jpg",
  "/default-bg/3.jpg",
  "/default-bg/squrall.jpg"
];

/* ================= UTIL FUNCTIONS ================= */

function formatTime(date, mode) {
  return mode === "12"
    ? date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    : date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
}

function getTimeInZone(zone) {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: zone }));
}

/* ================= MAIN APP ================= */

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [now, setNow] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);

  const [clocks, setClocks] = useState(() => {
    const saved = localStorage.getItem("clocks");
    return saved ? JSON.parse(saved) : defaultClocks;
  });

  const [bgMode, setBgMode] = useState(
    localStorage.getItem("bgMode") || "manual"
  );

  const [bgIndex, setBgIndex] = useState(() => {
    const saved = localStorage.getItem("bgIndex");
    return saved ? Number(saved) : 0;
  });

  /* ================= CLOCK TIMER ================= */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ================= SAVE SETTINGS ================= */
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("clocks", JSON.stringify(clocks));
    localStorage.setItem("bgMode", bgMode);
    localStorage.setItem("bgIndex", bgIndex);
  }, [theme, clocks, bgMode, bgIndex]);

  /* ================= AUTO BACKGROUND LOGIC ================= */
  useEffect(() => {
    if (!staticBackgrounds.length) return;

    if (bgMode === "random") {
      const randomIndex = Math.floor(
        Math.random() * staticBackgrounds.length
      );
      setBgIndex(randomIndex);
    }

    if (bgMode === "daily") {
      const today = new Date().toDateString();
      const savedDay = localStorage.getItem("bgDay");

      if (savedDay !== today) {
        const next = (bgIndex + 1) % staticBackgrounds.length;
        setBgIndex(next);
        localStorage.setItem("bgDay", today);
      }
    }
  }, [bgMode, bgIndex]);

  const mainTime = formatTime(now, "24");

  return (
    <div
      className={`app app-${theme}`}
      style={{
        backgroundImage: `url(${staticBackgrounds[bgIndex]})`
      }}
    >
      <div className="overlay" />

      <div className="content">
        {/* ================= TOP BAR ================= */}
        <div className="top-bar">
          <div className="greeting">Coder Desk</div>

          <div>
            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            <button
              className="theme-toggle"
              onClick={() => setShowSettings(!showSettings)}
              style={{ marginLeft: 10 }}
            >
              ⚙
            </button>
          </div>
        </div>

        {/* ================= MAIN CLOCK ================= */}
        <div className="main-clock">{mainTime}</div>

        {/* ================= WORLD CLOCKS ================= */}
        <div className="world-clocks">
          {clocks
            .filter((c) => c.enabled)
            .map((c) => {
              const zoned = getTimeInZone(c.zone);
              return (
                <div key={c.id} className="clock-card">
                  <div className="clock-label">{c.label}</div>
                  <div className="clock-time">
                    {formatTime(zoned, c.format)}
                  </div>
                  <div className="clock-format">
                    {c.format === "12" ? "12h" : "24h"}
                  </div>
                </div>
              );
            })}
        </div>

        {/* ================= SEARCH ================= */}
        <div className="search-box">
          <input
            placeholder="Search Google..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                window.location.href =
                  "https://www.google.com/search?q=" + e.target.value;
              }
            }}
          />
        </div>

        {/* ================= SHORTCUTS ================= */}
        <div className="shortcuts">
          {shortcuts.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              className="shortcut-btn"
              rel="noreferrer"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* ================= CREDIT ================= */}
        <div className="credit">Clicked By @silentvibeslens</div>
      </div>

      {/* ================= SETTINGS PANEL ================= */}
      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>

          {/* ===== CLOCK SETTINGS ===== */}
          <h4>Clocks</h4>
          {clocks.map((c, i) => (
            <div key={c.id} className="setting-row">
              <input
                value={c.label}
                onChange={(e) => {
                  const copy = [...clocks];
                  copy[i].label = e.target.value;
                  setClocks(copy);
                }}
              />

              <select
                value={c.zone}
                onChange={(e) => {
                  const copy = [...clocks];
                  copy[i].zone = e.target.value;
                  setClocks(copy);
                }}
              >
                <option value="Asia/Kolkata">India</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">New York</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Dubai">Dubai</option>
              </select>

              <select
                value={c.format}
                onChange={(e) => {
                  const copy = [...clocks];
                  copy[i].format = e.target.value;
                  setClocks(copy);
                }}
              >
                <option value="12">12h</option>
                <option value="24">24h</option>
              </select>

              <input
                type="checkbox"
                checked={c.enabled}
                onChange={(e) => {
                  const copy = [...clocks];
                  copy[i].enabled = e.target.checked;
                  setClocks(copy);
                }}
              />
            </div>
          ))}

          {/* ===== BACKGROUND SETTINGS (STATIC ONLY) ===== */}
          <h4 style={{ marginTop: 20 }}>Background</h4>

          <select
            value={bgMode}
            onChange={(e) => setBgMode(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 10 }}
          >
            <option value="manual">Manual</option>
            <option value="daily">Daily Change</option>
            <option value="random">Random on Every New Tab</option>
          </select>

          {/* ✅ STATIC IMAGE GALLERY */}
          {bgMode === "manual" && (
            <div className="bg-thumbs">
              {staticBackgrounds.map((img, index) => (
                <div key={index} className="bg-thumb-wrapper">
                  <img
                    src={img}
                    onClick={() => setBgIndex(index)}
                    className={index === bgIndex ? "active-bg" : ""}
                  />
                </div>
              ))}
            </div>
          )}

          <button onClick={() => setShowSettings(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
