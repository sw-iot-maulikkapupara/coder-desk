import { useState } from "react";
import { encodeUrlText, decodeUrlText } from "../../utils/toolbox";

/**
 * UrlTool component for encoding and decoding URLs and URI components.
 * Operates purely in-memory.
 */
export default function UrlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleEncode = (mode = "component") => {
    setError(null);
    const { success, result, error: err } = encodeUrlText(input, mode);
    if (success) {
      setOutput(result);
    } else {
      setError(err);
      setOutput("");
    }
  };

  const handleDecode = (mode = "component") => {
    setError(null);
    const { success, result, error: err } = decodeUrlText(input, mode);
    if (success) {
      setOutput(result);
    } else {
      setError(err);
      setOutput("");
    }
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError(null);
    setCopied(false);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setCopied(false);
  };

  const handleLoadSample = () => {
    const sample = "https://example.com/api/search?q=developer tools & category=react#hash";
    setInput(sample);
    setError(null);
    const { result } = encodeUrlText(sample, "component");
    setOutput(result || "");
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="toolbox-tool url-tool">
      <div className="toolbox-section">
        <div className="toolbox-field-header">
          <label htmlFor="url-input" className="toolbox-label">
            URL / Text Input
          </label>
          <button
            type="button"
            className="toolbox-text-btn"
            onClick={handleLoadSample}
          >
            Load Sample
          </button>
        </div>

        <textarea
          id="url-input"
          className="toolbox-textarea"
          placeholder="Paste URL, parameters, or text here..."
          value={input}
          rows={5}
          spellCheck="false"
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="toolbox-actions-bar">
        <div className="toolbox-btn-group">
          <button
            type="button"
            className="toolbox-btn primary"
            onClick={() => handleEncode("component")}
          >
            Encode Component
          </button>
          <button
            type="button"
            className="toolbox-btn"
            onClick={() => handleDecode("component")}
          >
            Decode Component
          </button>
          <button
            type="button"
            className="toolbox-btn"
            onClick={() => handleEncode("full")}
          >
            Encode Full URL
          </button>
          <button
            type="button"
            className="toolbox-btn"
            onClick={() => handleDecode("full")}
          >
            Decode Full URL
          </button>
        </div>

        <div className="toolbox-btn-group">
          <button
            type="button"
            className="toolbox-btn"
            onClick={handleSwap}
            disabled={!output}
            title="Move output text into the input field"
          >
            ⇄ Swap
          </button>
          <button
            type="button"
            className="toolbox-btn danger"
            onClick={handleClear}
            disabled={!input && !output && !error}
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="toolbox-error" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {output && (
        <div className="toolbox-section">
          <div className="toolbox-field-header">
            <label htmlFor="url-output" className="toolbox-label">
              Result
            </label>
            <button
              type="button"
              className="toolbox-copy-btn"
              onClick={handleCopy}
            >
              {copied ? "✓ Copied!" : "📋 Copy Result"}
            </button>
          </div>

          <textarea
            id="url-output"
            className="toolbox-textarea code-output"
            readOnly
            rows={5}
            value={output}
          />
        </div>
      )}
    </div>
  );
}
