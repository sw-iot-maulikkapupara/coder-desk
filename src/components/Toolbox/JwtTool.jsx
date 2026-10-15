import { useState } from "react";
import { decodeJwt } from "../../utils/toolbox";

/**
 * JwtTool component for decoding JWT headers and payloads locally.
 *
 * PRIVACY & SECURITY:
 * - All parsing is performed locally in browser memory.
 * - No tokens are transmitted or saved to persistent storage.
 * - Displays a clear disclaimer that signatures are NOT verified.
 */
export default function JwtTool() {
  const [tokenInput, setTokenInput] = useState("");
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState(null);
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleDecode = (tokenStr) => {
    setError(null);
    if (!tokenStr.trim()) {
      setDecoded(null);
      return;
    }

    const result = decodeJwt(tokenStr);
    if (result.success) {
      setDecoded(result);
    } else {
      setError(result.error);
      setDecoded(null);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setTokenInput(val);
    handleDecode(val);
  };

  const handleClear = () => {
    setTokenInput("");
    setDecoded(null);
    setError(null);
    setCopiedHeader(false);
    setCopiedPayload(false);
  };

  const handleLoadSample = () => {
    const sample =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYtMTIzNDUiLCJuYW1lIjoiQWxleCBQcm9ncmFtbWVyIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    setTokenInput(sample);
    handleDecode(sample);
  };

  const handleCopy = async (text, setCopied) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy to clipboard:", err);
    }
  };

  const headerString = decoded?.header ? JSON.stringify(decoded.header, null, 2) : "";
  const payloadString = decoded?.payload ? JSON.stringify(decoded.payload, null, 2) : "";

  return (
    <div className="toolbox-tool jwt-tool">
      {/* Prominent Security Notice */}
      <div className="toolbox-notice warning" role="note">
        <span className="notice-icon">⚠️</span>
        <div>
          <strong>Security Notice:</strong> This tool only decodes the Base64Url structure.
          It <strong>does NOT verify cryptographic signatures or token authenticity</strong>.
          Never treat decoded token contents as trusted without server-side validation.
        </div>
      </div>

      <div className="toolbox-section">
        <div className="toolbox-field-header">
          <label htmlFor="jwt-input" className="toolbox-label">
            JWT Token
          </label>
          <div className="toolbox-header-actions">
            <button
              type="button"
              className="toolbox-text-btn"
              onClick={handleLoadSample}
            >
              Load Sample
            </button>
            <button
              type="button"
              className="toolbox-text-btn danger"
              onClick={handleClear}
              disabled={!tokenInput && !decoded && !error}
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="jwt-input"
          className="toolbox-textarea jwt-input"
          placeholder="Paste your encoded JWT (header.payload.signature) here..."
          value={tokenInput}
          rows={4}
          spellCheck="false"
          onChange={handleInputChange}
        />
      </div>

      {error && (
        <div className="toolbox-error" role="alert">
          {error}
        </div>
      )}

      {decoded && (
        <div className="jwt-results">
          {/* Claims / Dates Summary */}
          {decoded.claims && (decoded.claims.issuedAt || decoded.claims.expiresAt) && (
            <div className="jwt-claims-summary">
              {decoded.claims.expiresAt && (
                <div className="claim-item">
                  <span className="claim-label">Expires (exp):</span>
                  <span className="claim-val">
                    {decoded.claims.expiresAt}{" "}
                    {decoded.claims.isExpired ? (
                      <span className="badge expired">🔴 Expired</span>
                    ) : (
                      <span className="badge active">🟢 Active</span>
                    )}
                  </span>
                </div>
              )}
              {decoded.claims.issuedAt && (
                <div className="claim-item">
                  <span className="claim-label">Issued At (iat):</span>
                  <span className="claim-val">{decoded.claims.issuedAt}</span>
                </div>
              )}
            </div>
          )}

          {/* Header & Payload Columns */}
          <div className="jwt-cols">
            <div className="jwt-col">
              <div className="toolbox-field-header">
                <span className="toolbox-label">Header (Algorithm &amp; Token Type)</span>
                <button
                  type="button"
                  className="toolbox-copy-btn"
                  onClick={() => handleCopy(headerString, setCopiedHeader)}
                >
                  {copiedHeader ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              <textarea
                className="toolbox-textarea code-output"
                readOnly
                rows={6}
                value={headerString}
              />
            </div>

            <div className="jwt-col">
              <div className="toolbox-field-header">
                <span className="toolbox-label">Payload (Data / Claims)</span>
                <button
                  type="button"
                  className="toolbox-copy-btn"
                  onClick={() => handleCopy(payloadString, setCopiedPayload)}
                >
                  {copiedPayload ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              <textarea
                className="toolbox-textarea code-output"
                readOnly
                rows={8}
                value={payloadString}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
