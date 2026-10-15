import { DEFAULT_SHORTCUTS } from "../constants.js";

/**
 * Allowed URL protocols for developer shortcuts.
 */
const ALLOWED_PROTOCOLS = new Set(["https:", "http:"]);

/**
 * Validates and sanitizes a user-provided shortcut URL.
 * Automatically adds 'https://' if protocol is omitted.
 * Only permits HTTP and HTTPS protocols.
 *
 * @param {string} inputUrl - The raw URL string from the user.
 * @returns {{ isValid: boolean, sanitizedUrl: string, error?: string }}
 */
export function validateAndSanitizeUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== "string") {
    return { isValid: false, sanitizedUrl: "", error: "URL is required" };
  }

  let trimmed = inputUrl.trim();
  if (!trimmed) {
    return { isValid: false, sanitizedUrl: "", error: "URL cannot be empty" };
  }

  // If no scheme/protocol is present, default to https://
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);

    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return {
        isValid: false,
        sanitizedUrl: "",
        error: "Only HTTPS and HTTP protocols are allowed (e.g. https://...)"
      };
    }

    // Must have a valid hostname
    if (!parsed.hostname || (!parsed.hostname.includes(".") && parsed.hostname !== "localhost")) {
      return {
        isValid: false,
        sanitizedUrl: "",
        error: "Please enter a valid domain (e.g. github.com)"
      };
    }

    return { isValid: true, sanitizedUrl: parsed.href };
  } catch {
    return {
      isValid: false,
      sanitizedUrl: "",
      error: "Please enter a valid web URL"
    };
  }
}

/**
 * Generates a unique shortcut identifier.
 *
 * @returns {string}
 */
export function generateShortcutId() {
  return `shortcut-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Migrates and sanitizes shortcut lists from localStorage.
 * Ensures every item has a unique id, non-empty label, and valid URL.
 *
 * @param {any} saved - Raw value from localStorage.
 * @returns {Array<{id: string, label: string, url: string}>}
 */
export function sanitizeSavedShortcuts(saved) {
  if (!Array.isArray(saved) || saved.length === 0) {
    return DEFAULT_SHORTCUTS;
  }

  return saved
    .filter((item) => item && typeof item === "object")
    .map((item, index) => {
      const label = typeof item.label === "string" && item.label.trim()
        ? item.label.trim()
        : `Shortcut ${index + 1}`;

      const { isValid, sanitizedUrl } = validateAndSanitizeUrl(item.url || "");
      const url = isValid ? sanitizedUrl : "https://github.com";
      const id = item.id || `shortcut-${index}-${Date.now()}`;

      return { id, label, url };
    });
}
