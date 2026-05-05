import { cookies } from "next/headers";
import { getQfOAuthConfig, getQfCookieName } from "./qf-oauth-config";
import { refreshAccessToken, QfTokenResponse } from "./qf-oauth-exchanger";
import { logDiagnostic } from "./qf-error-utils";
import { CONFIG as NEWCONFIG } from "./api-config";

/**
 * Global Map to track active refresh promises per refresh token.
 */
const refreshPromises = new Map<string, Promise<QfTokenResponse>>();

/**
 * Authenticated API client helper for Quran Foundation User APIs.
 */
export async function qfFetch(
  path: string,
  options: RequestInit & { baseUrl?: string } = {}
): Promise<Response> {
  const config = getQfOAuthConfig();
  const cookieStore = await cookies();

  const accessTokenKey = getQfCookieName("access_token");
  const refreshTokenKey = getQfCookieName("refresh_token");

  let accessToken = cookieStore.get(accessTokenKey)?.value;
  const refreshToken = cookieStore.get(refreshTokenKey)?.value;
  const clientId = config.clientId;

  const buildHeaders = (token?: string) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("x-auth-token", token);
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("x-client-id", clientId);
    return headers;
  };

  const baseUrl = options.baseUrl || `${config.apiBaseUrl}/auth/v1`;
  const url = `${baseUrl}${path.startsWith("/") || !path ? path : `/${path}`}`;

  // Step 1: Initial request attempt
  let res = await fetch(url, {
    ...options,
    headers: buildHeaders(accessToken),
  });

  // Step 2: Handle 401 Unauthorized with automatic refresh and retry
  if (res.status === 401 && refreshToken) {
    console.log(`QF API [${config.env}]: Access token expired (401). Attempting refresh...`);

    try {
      if (!refreshPromises.has(refreshToken)) {
        refreshPromises.set(
          refreshToken,
          refreshAccessToken({ refreshToken }).finally(() => {
            refreshPromises.delete(refreshToken);
          })
        );
      }

      const tokenData = await refreshPromises.get(refreshToken)!;
      accessToken = tokenData.access_token;

      const secureCookieOptions = {
        httpOnly: true,
        secure: NEWCONFIG.NODE_ENV === "production",
        path: "/",
        sameSite: "lax" as const,
      };

      cookieStore.set(accessTokenKey, tokenData.access_token, {
        ...secureCookieOptions,
        maxAge: tokenData.expires_in || 3600,
      });

      if (tokenData.refresh_token) {
        cookieStore.set(refreshTokenKey, tokenData.refresh_token, {
          ...secureCookieOptions,
          maxAge: 30 * 24 * 60 * 60,
        });
      }

      // Step 3: Retry the original request exactly ONCE
      console.log(`QF API [${config.env}]: Token refreshed. Retrying request...`);
      res = await fetch(url, {
        ...options,
        headers: buildHeaders(accessToken),
      });

    } catch (refreshError) {
      // If refresh failed, we log it and let the 401 response through
      console.error(`QF API [${config.env}]: Automatic refresh failed. User must re-auth.`);
    }
  }

  // Step 4: Handle terminal errors with sanitized logging
  if (!res.ok) {
    const errorData = await res.clone().json().catch(() => ({}));
    logDiagnostic("User API Call", res, errorData);

    // Specific handling for 403 Forbidden (Permission issues)
    if (res.status === 403) {
      console.warn(`QF API [${config.env}]: Permission denied at ${path}. Possible missing scope.`);
    }
  }

  return res;
}
