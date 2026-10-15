import { useState } from "react";
import { formatJson, minifyJson } from "../../utils/toolbox";

/**
 * JsonTool component for formatting and minifying JSON data.
 * All operations execute locally in-memory.
 */
export default function JsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = (indent = 2) => {
    setError(null);
    const { success, result, error: formatErr } = formatJson(input, indent);
    if (success) {
      setOutput(result);
    } else {
      setError(formatErr);
      setOutput("");
    }
  };

  const handleMinify = () => {
    setError(null);
    const { success, result, error: minifyErr } = minifyJson(input);
    if (success) {
      setOutput(result);
    } else {
      setError(minifyErr);
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setCopied(false);
  };

  const handleLoadSample = () => {
    const sample = '{"tool":"Coder Desk","category":"Developer Toolbox","utilities":["JSON Formatter","JWT Decoder","URL Encoder"],"isLocal":true,"status":"active"}';
    setInput(sample);
    setError(null);
    const { result } = formatJson(sample, 2);
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
    <div className="toolbox-tool json-tool">
      <div className="toolbox-section">
        <div className="toolbox-field-header">
          <label htmlFor="json-input" className="toolbox-label">
            JSON Input
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
          id="json-input"
          className="toolbox-textarea"
          placeholder='Paste your JSON here (e.g. {"key": "value"})...'
          value={input}
          rows={6}
          spellCheck="false"
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="toolbox-actions-bar">
        <div className="toolbox-btn-group">
          <button
            type="button"
            className="toolbox-btn primary"
            onClick={() => handleFormat(2)}
          >
            Format (2 Spaces)
          </button>
          <button
            type="button"
            className="toolbox-btn"
            onClick={() => handleFormat(4)}
          >
            Format (4 Spaces)
          </button>
          <button
            type="button"
            className="toolbox-btn"
            onClick={handleMinify}
          >
            Minify
          </button>
        </div>

        <button
          type="button"
          className="toolbox-btn danger"
          onClick={handleClear}
          disabled={!input && !output && !error}
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="toolbox-error" role="alert">
          <strong>Syntax Error:</strong> {error}
        </div>
      )}

      {output && (
        <div className="toolbox-section">
          <div className="toolbox-field-header">
            <label htmlFor="json-output" className="toolbox-label">
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
            id="json-output"
            className="toolbox-textarea code-output"
            readOnly
            rows={8}
            value={output}
          />
        </div>
      )}
    </div>
  );
}
