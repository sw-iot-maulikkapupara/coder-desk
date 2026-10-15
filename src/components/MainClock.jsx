import { memo } from "react";
import { formatTime } from "../utils/time";

/**
 * Main digital clock display with localized date.
 * Features:
 * - Fluid typography (clamp)
 * - Tabular numbers to eliminate jitter
 * - High readability over bright and dark backgrounds
 *
 * @param {Object} props
 * @param {Date} [props.now] - Current Date instance.
 * @param {string} [props.time] - Optional pre-formatted time string.
 * @param {"12" | "24"} [props.format="24"] - Time display format.
 */
function MainClock({ now, time, format = "24" }) {
  const displayTime = time ?? (now ? formatTime(now, format) : "--:--:--");
  const dateString = now
    ? now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
      })
    : null;

  return (
    <div className="main-clock-wrapper">
      <div className="main-clock" aria-label={`Current time: ${displayTime}`}>
        {displayTime}
      </div>
      {dateString && (
        <div className="main-clock-date" aria-label={`Current date: ${dateString}`}>
          {dateString}
        </div>
      )}
    </div>
  );
}

export default memo(MainClock);
