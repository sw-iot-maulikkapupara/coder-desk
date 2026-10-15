import { memo } from "react";
import { STATIC_BACKGROUNDS, STATIC_THUMBNAILS } from "../constants";

/**
 * BackgroundGallery component rendering lightweight thumbnail previews for manual selection.
 * Memoized to prevent re-renders when parent states change.
 *
 * @param {Object} props
 * @param {string[]} [props.backgrounds=STATIC_BACKGROUNDS] - Full background image paths.
 * @param {string[]} [props.thumbnails=STATIC_THUMBNAILS] - Optimized thumbnail image paths.
 * @param {number} props.activeIndex - Index of currently selected background.
 * @param {(index: number) => void} props.onSelect - Callback when a thumbnail is selected.
 */
function BackgroundGallery({
  backgrounds = STATIC_BACKGROUNDS,
  thumbnails = STATIC_THUMBNAILS,
  activeIndex,
  onSelect
}) {
  return (
    <div className="bg-thumbs" role="radiogroup" aria-label="Background image selection">
      {backgrounds.map((img, index) => {
        const thumbSrc = thumbnails[index] || img;
        const isSelected = index === activeIndex;

        return (
          <div key={img} className="bg-thumb-wrapper">
            <button
              type="button"
              className={`bg-thumb-btn ${isSelected ? "selected" : ""}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Select background ${index + 1}`}
              onClick={() => onSelect(index)}
            >
              <img
                src={thumbSrc}
                alt=""
                loading="lazy"
                width="72"
                height="46"
                className={isSelected ? "active-bg" : ""}
                onError={(e) => {
                  if (e.currentTarget.src !== img) {
                    e.currentTarget.src = img;
                  }
                }}
              />
              {isSelected && (
                <span className="bg-thumb-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default memo(BackgroundGallery);
