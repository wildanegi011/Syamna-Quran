import { getQfOAuthConfig } from "./qf-oauth-config";

/**
 * Mapping of technical OAuth2 error codes to user-friendly, actionable hints.
 */
export const QF_OAUTH_ERROR_MAP: Record<string, string> = {
  invalid_client: "Configuration error: invalid client credentials or environment mismatch.",
  invalid_grant: "Session expired or authorization code already used. Please log in again.",
  redirect_uri_mismatch: "Configuration error: redirect URI mismatch. Please check your settings.",
  invalid_scope: "Configuration error: requested scope is not allowed or misspelled.",
  access_denied: "Permission denied. Please grant the requested permissions to continue.",
  unsupported_grant_type: "Configuration error: unsupported grant type.",
  invalid_request: "Invalid request. Please try again.",
};

/**
 * Maps a technical OAuth2 error code to an actionable hint.
 * 
 * @param error - The technical error code (e.g., "invalid_grant").
 * @param description - Optional description from the provider.
 * @returns {string} An actionable error message.
 */
export function mapOAuthError(error: string, description?: string): string {
  return QF_OAUTH_ERROR_MAP[error] || description || "An unexpected authentication error occurred.";
}

/**
 * Logs a sanitized diagnostic message for failed API or OAuth requests.
 * Strictly adheres to the "No Log" policy for secrets.
 * 
 * @param context - Human-readable context (e.g., "Token Exchange").
 * @param res - The failed Response object.
 * @param data - The parsed error data (optional).
 */
export function logDiagnostic(context: string, res: Response, data: any = {}): void {
  const config = getQfOAuthConfig();
  
  // Extract path without query parameters to avoid leaking potential secrets in URLs
  const url = new URL(res.url);
  const safePath = url.pathname;

  console.error(`[QF ${config.env.toUpperCase()}] ${context} Failure:`, {
    status: res.status,
    path: safePath,
    error: data.error || "Unknown",
    // We log only the error type/code, never the full sensitive details if they contain tokens
    hint: QF_OAUTH_ERROR_MAP[data.error] || "Check provider documentation."
  });
}
