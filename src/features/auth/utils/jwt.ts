/**
 * Zero-dependency JWT helpers for reading the `exp` claim client-side.
 * The token is an opaque string stored in `user.token`; we only decode the
 * payload to check expiration — signature is never verified here.
 */

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

function decodePayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  // base64url -> base64
  let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);

  const json = atob(base64);
  return JSON.parse(json) as JwtPayload;
}

/** Returns the `exp` claim (seconds since epoch) or null if missing/malformed. */
export function getTokenExp(token: string): number | null {
  try {
    const payload = decodePayload(token);
    return typeof payload?.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/** True when there is no token, no `exp`, the token is malformed, or it has expired. */
export function isTokenExpired(token: string | undefined | null): boolean {
  if (!token) return true;
  const exp = getTokenExp(token);
  if (exp === null) return true;
  return exp * 1000 <= Date.now();
}
