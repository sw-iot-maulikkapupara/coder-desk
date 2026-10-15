/**
 * Cache for Intl.DateTimeFormat instances to avoid expensive instantiation
 * on every clock tick (60+ times per minute).
 */
const formatterCache = new Map();

/**
 * Validates whether a timezone identifier is supported by the current JavaScript runtime.
 *
 * @param {string} timeZone - Timezone string to test (e.g. "Asia/Kolkata", "UTC").
 * @returns {boolean} True if the timezone is valid and supported.
 */
export function isValidTimeZone(timeZone) {
  if (!timeZone || typeof timeZone !== "string") return false;

  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves or creates a cached Intl.DateTimeFormat instance.
 *
 * @param {string | undefined} timeZone - Optional IANA timezone.
 * @param {"12" | "24"} mode - 12h or 24h format.
 * @returns {Intl.DateTimeFormat}
 */
function getCachedFormatter(timeZone, mode) {
  const is12 = mode === "12";
  const validZone = timeZone && isValidTimeZone(timeZone) ? timeZone : undefined;
  const cacheKey = `${validZone || "LOCAL"}_${mode}`;

  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    const locale = is12 ? "en-US" : "en-GB";
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: is12
    };

    if (validZone) {
      options.timeZone = validZone;
    }

    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(cacheKey, formatter);
  }

  return formatter;
}

/**
 * Formats a Date object into 12-hour or 24-hour time string using cached formatters.
 *
 * @param {Date} date - The Date instance to format.
 * @param {"12" | "24"} [mode="24"] - Time display format.
 * @returns {string} Formatted time string.
 */
export function formatTime(date, mode = "24") {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "--:--:--";
  }

  try {
    return getCachedFormatter(undefined, mode).format(date);
  } catch {
    return "--:--:--";
  }
}

/**
 * Formats a Date object for a specific IANA timezone into 12-hour or 24-hour time.
 * Validates timezone and falls back to local time safely if invalid.
 *
 * @param {Date} date - The Date instance to format.
 * @param {string} zone - IANA timezone identifier.
 * @param {"12" | "24"} [mode="24"] - Time display format.
 * @returns {string} Formatted time string in the target timezone.
 */
export function formatZonedTime(date, zone, mode = "24") {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "--:--:--";
  }

  try {
    return getCachedFormatter(zone, mode).format(date);
  } catch (error) {
    console.warn(`Error formatting timezone "${zone}". Falling back to local time.`, error);
    return formatTime(date, mode);
  }
}

/**
 * Legacy helper for backwards compatibility.
 * Prefer formatZonedTime for direct timezone rendering.
 *
 * @param {string} zone - IANA timezone identifier.
 * @returns {Date}
 */
export function getTimeInZone(zone) {
  const now = new Date();
  if (!isValidTimeZone(zone)) return now;

  try {
    return new Date(now.toLocaleString("en-US", { timeZone: zone }));
  } catch {
    return now;
  }
}
