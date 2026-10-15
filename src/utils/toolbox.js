/**
 * Developer Toolbox pure utility functions.
 * All computations run locally and synchronously in memory.
 */

/* ==========================================================================
   1. JSON Formatter & Minifier
   ========================================================================== */

/**
 * Formats a JSON string with indentation.
 *
 * @param {string} input - Raw JSON string.
 * @param {number} [indent=2] - Indentation spaces.
 * @returns {{ success: boolean, result?: string, error?: string }}
 */
export function formatJson(input, indent = 2) {
  if (!input || typeof input !== "string" || !input.trim()) {
    return { success: false, error: "Please enter JSON to format." };
  }

  try {
    const parsed = JSON.parse(input);
    return {
      success: true,
      result: JSON.stringify(parsed, null, indent)
    };
  } catch (err) {
    return {
      success: false,
      error: `Invalid JSON: ${err.message}`
    };
  }
}

/**
 * Minifies a JSON string into a single-line compact format.
 *
 * @param {string} input - Raw JSON string.
 * @returns {{ success: boolean, result?: string, error?: string }}
 */
export function minifyJson(input) {
  if (!input || typeof input !== "string" || !input.trim()) {
    return { success: false, error: "Please enter JSON to minify." };
  }

  try {
    const parsed = JSON.parse(input);
    return {
      success: true,
      result: JSON.stringify(parsed)
    };
  } catch (err) {
    return {
      success: false,
      error: `Invalid JSON: ${err.message}`
    };
  }
}

/* ==========================================================================
   2. JWT Decoder (Header & Payload)
   ========================================================================== */

/**
 * Decodes a base64url-encoded string into a standard UTF-8 string.
 *
 * @param {string} base64UrlStr
 * @returns {string} Decoded UTF-8 string.
 */
export function decodeBase64Url(base64UrlStr) {
  if (!base64UrlStr || typeof base64UrlStr !== "string") {
    throw new Error("Invalid base64url string.");
  }

  // Convert Base64URL to standard Base64
  let base64 = base64UrlStr.replace(/-/g, "+").replace(/_/g, "/");

  // Pad with '=' so length is a multiple of 4
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  // Decode base64 to binary string
  const binaryString = atob(base64);

  // Convert binary string to UTF-8
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}

/**
 * Decodes a JWT token string into its header, payload, and claims info.
 * NOTE: Does NOT verify cryptographic signature or token authenticity.
 *
 * @param {string} token - Raw JWT token string.
 * @returns {{
 *   success: boolean,
 *   header?: Record<string, any>,
 *   payload?: Record<string, any>,
 *   signature?: string,
 *   claims?: {
 *     issuedAt?: string,
 *     expiresAt?: string,
 *     notBefore?: string,
 *     isExpired?: boolean
 *   },
 *   error?: string
 * }}
 */
export function decodeJwt(token) {
  if (!token || typeof token !== "string" || !token.trim()) {
    return { success: false, error: "Please enter a JWT token to decode." };
  }

  const trimmed = token.trim();
  const parts = trimmed.split(".");

  if (parts.length !== 3) {
    return {
      success: false,
      error: `Invalid JWT format. A valid token must have exactly 3 parts separated by dots (header.payload.signature). Found ${parts.length} part(s).`
    };
  }

  let header;
  let payload;

  try {
    const headerJson = decodeBase64Url(parts[0]);
    header = JSON.parse(headerJson);
  } catch (err) {
    return {
      success: false,
      error: `Could not decode token header: ${err.message}`
    };
  }

  try {
    const payloadJson = decodeBase64Url(parts[1]);
    payload = JSON.parse(payloadJson);
  } catch (err) {
    return {
      success: false,
      error: `Could not decode token payload: ${err.message}`
    };
  }

  // Parse common standard date claims
  const claims = {};
  const nowMs = Date.now();

  if (typeof payload === "object" && payload !== null) {
    if (typeof payload.iat === "number") {
      claims.issuedAt = new Date(payload.iat * 1000).toLocaleString();
    }
    if (typeof payload.exp === "number") {
      claims.expiresAt = new Date(payload.exp * 1000).toLocaleString();
      claims.isExpired = payload.exp * 1000 < nowMs;
    }
    if (typeof payload.nbf === "number") {
      claims.notBefore = new Date(payload.nbf * 1000).toLocaleString();
    }
  }

  return {
    success: true,
    header,
    payload,
    signature: parts[2],
    claims
  };
}

/* ==========================================================================
   3. URL Component Encoder & Decoder
   ========================================================================== */

/**
 * Encodes a URL string or component.
 *
 * @param {string} input - Text to encode.
 * @param {"component" | "full"} [mode="component"] - Encoding mode.
 * @returns {{ success: boolean, result?: string, error?: string }}
 */
export function encodeUrlText(input, mode = "component") {
  if (!input || typeof input !== "string") {
    return { success: false, error: "Please enter text to encode." };
  }

  try {
    const result = mode === "full" ? encodeURI(input) : encodeURIComponent(input);
    return { success: true, result };
  } catch (err) {
    return { success: false, error: `Encoding error: ${err.message}` };
  }
}

/**
 * Decodes an encoded URL string or component.
 *
 * @param {string} input - Encoded text to decode.
 * @param {"component" | "full"} [mode="component"] - Decoding mode.
 * @returns {{ success: boolean, result?: string, error?: string }}
 */
export function decodeUrlText(input, mode = "component") {
  if (!input || typeof input !== "string") {
    return { success: false, error: "Please enter text to decode." };
  }

  try {
    const result = mode === "full" ? decodeURI(input) : decodeURIComponent(input);
    return { success: true, result };
  } catch (err) {
    return {
      success: false,
      error: `Decoding error: Malformed URL sequence (${err.message})`
    };
  }
}
