import { useState, useEffect, memo } from "react";
import JsonTool from "./JsonTool";
import JwtTool from "./JwtTool";
import UrlTool from "./UrlTool";

const TOOLS = [
  { id: "json", label: "{ } JSON Formatter", component: JsonTool },
  { id: "jwt", label: "🔑 JWT Decoder", component: JwtTool },
  { id: "url", label: "🔗 URL Encoder/Decoder", component: UrlTool }
];

/**
 * ToolboxModal component rendering the developer toolbox interface.
 * Features:
 * - Accessible dialog semantics
 * - Tab switching between the 3 tools
 * - Keyboard navigation (Esc to dismiss)
 * - Backdrop click dismissal
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible.
 * @param {() => void} props.onClose - Callback to close the modal.
 */
function ToolboxModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("json");

  // Handle Escape key to close modal
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

  const ActiveComponent = TOOLS.find((t) => t.id === activeTab)?.component || JsonTool;

  return (
    <>
      {/* Backdrop */}
      <div
        className="toolbox-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="toolbox-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Developer Toolbox"
      >
        <div className="toolbox-header">
          <div className="toolbox-title-group">
            <span className="toolbox-icon">🧰</span>
            <h3>Developer Toolbox</h3>
          </div>

          <button
            type="button"
            className="toolbox-close-btn"
            onClick={onClose}
            aria-label="Close Developer Toolbox"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="toolbox-tabs" role="tablist" aria-label="Toolbox Categories">
          {TOOLS.map((tool) => {
            const isSelected = activeTab === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                role="tab"
                id={`tab-${tool.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tool.id}`}
                className={`toolbox-tab ${isSelected ? "active" : ""}`}
                onClick={() => setActiveTab(tool.id)}
              >
                {tool.label}
              </button>
            );
          })}
        </div>

        {/* Tool Content Area */}
        <div
          className="toolbox-content"
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <ActiveComponent />
        </div>
      </div>
    </>
  );
}

export default memo(ToolboxModal);
