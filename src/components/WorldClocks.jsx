import { memo } from "react";
import { formatZonedTime } from "../utils/time";

/**
 * WorldClocks component displaying configured timezone clocks.
 * Features:
 * - Card header with label and format pill badge
 * - Monospace tabular figures to prevent wobble
 * - High-contrast glassmorphic card styling
 *
 * @param {Object} props
 * @param {Array<{id: number, label: string, zone: string, format: string, enabled: boolean}>} props.clocks
 * @param {Date} props.now - Shared current timestamp for synchronized rendering.
 */
function WorldClocks({ clocks, now }) {
  if (!Array.isArray(clocks)) {
    return null;
  }

  const enabledClocks = clocks.filter((clock) => clock && clock.enabled);

  if (!enabledClocks.length) {
    return null;
  }

  return (
    <section className="world-clocks" aria-label="World Clocks">
      {enabledClocks.map((clock) => {
        const label = clock.label || "Clock";
        const zone = clock.zone || "UTC";
        const format = clock.format === "12" ? "12" : "24";
        const timeString = formatZonedTime(now, zone, format);

        return (
          <div key={clock.id} className="clock-card">
            <div className="clock-card-header">
              <span className="clock-label">{label}</span>
              <span className="clock-format-pill">{format === "12" ? "12h" : "24h"}</span>
            </div>
            <div className="clock-time">{timeString}</div>
          </div>
        );
      })}
    </section>
  );
}

export default memo(WorldClocks);
