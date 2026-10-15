import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for synchronizing state with localStorage.
 * - Safely handles missing, invalid, or corrupted JSON values.
 * - Validates data types against fallback values (e.g. ensuring arrays stay arrays).
 * - Avoids redundant writes on initial mount to minimize disk I/O on new tab startup.
 *
 * @param {string} key - localStorage key.
 * @param {any | (() => any)} initialValue - Default value or initializer function.
 * @returns {[any, Function]} - [storedValue, setStoredValue]
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initialValue === "function" ? initialValue() : initialValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null || item === "undefined") {
        return fallback;
      }

      // Handle primitive numbers (e.g., bgIndex)
      if (typeof fallback === "number") {
        const parsedNum = Number(item);
        return Number.isNaN(parsedNum) ? fallback : parsedNum;
      }

      // Handle plain strings (e.g., theme, bgMode)
      if (typeof fallback === "string") {
        return item;
      }

      // Handle arrays and objects (e.g., clocks)
      const parsed = JSON.parse(item);

      // Guard: Ensure array types do not get overwritten by non-arrays
      if (Array.isArray(fallback) && !Array.isArray(parsed)) {
        console.warn(`Expected array for localStorage key "${key}", found non-array. Using fallback.`);
        return fallback;
      }

      // Guard: Ensure object types do not get overwritten by null/primitives
      if (typeof fallback === "object" && fallback !== null && (typeof parsed !== "object" || parsed === null)) {
        console.warn(`Expected object for localStorage key "${key}", found invalid value. Using fallback.`);
        return fallback;
      }

      return parsed;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return fallback;
    }
  });

  // Track initial mount so we do not write back unchanged initial values on startup
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    try {
      if (value === undefined) {
        localStorage.removeItem(key);
      } else if (typeof value === "string") {
        localStorage.setItem(key, value);
      } else if (typeof value === "number") {
        localStorage.setItem(key, String(value));
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
