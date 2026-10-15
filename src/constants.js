export const DEFAULT_CLOCKS = [
  { id: 1, label: "India", zone: "Asia/Kolkata", format: "12", enabled: true },
  { id: 2, label: "UTC", zone: "UTC", format: "24", enabled: true },
  { id: 3, label: "USA", zone: "America/New_York", format: "12", enabled: true },
  { id: 4, label: "Extra", zone: "Europe/London", format: "24", enabled: false }
];

export const DEFAULT_SHORTCUTS = [
  { id: "shortcut-github", label: "GitHub", url: "https://github.com" },
  { id: "shortcut-gmail", label: "Gmail", url: "https://mail.google.com" },
  { id: "shortcut-chatgpt", label: "ChatGPT", url: "https://chat.openai.com" },
  { id: "shortcut-calendar", label: "Calendar", url: "https://calendar.google.com" },
  { id: "shortcut-stackoverflow", label: "StackOverflow", url: "https://stackoverflow.com" },
  { id: "shortcut-outlook", label: "Outlook", url: "https://outlook.live.com" },
  { id: "shortcut-aitools", label: "AI Tools", url: "https://www.futuretools.io" }
];

export const SHORTCUTS = DEFAULT_SHORTCUTS;

export const STATIC_BACKGROUNDS = [
  "/default-bg/1.jpg",
  "/default-bg/2.jpg",
  "/default-bg/3.jpg",
  "/default-bg/squrall.jpg"
];

export const STATIC_THUMBNAILS = [
  "/default-bg/thumbs/1.jpg",
  "/default-bg/thumbs/2.jpg",
  "/default-bg/thumbs/3.jpg",
  "/default-bg/thumbs/squrall.jpg"
];

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "India" },
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York" },
  { value: "Europe/London", label: "London" },
  { value: "Asia/Dubai", label: "Dubai" }
];

export const BACKGROUND_MODES = [
  { value: "manual", label: "Manual" },
  { value: "daily", label: "Daily Change" },
  { value: "random", label: "Random on Every New Tab" }
];
