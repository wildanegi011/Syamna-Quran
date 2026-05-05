import { getQfOAuthConfig } from "./qf-oauth-config";
import { logDiagnostic, mapOAuthError, QF_OAUTH_ERROR_MAP } from "./qf-error-utils";

/**
 * Shape of the successful token response from Quran Foundation.
 */
export interface QfTokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

/**
 * Exchanges an authorization code for tokens using the Quran Foundation OAuth2 token endpoint.
 */
export async function exchangeAuthorizationCode({ 
  code, 
  redirectUri, 
  codeVerifier, 
  isConfidential 
}: { 
  code: string; 
  redirectUri: string; 
  codeVerifier: string; 
  isConfidential?: boolean; 
}): Promise<QfTokenResponse> {
  const config = getQfOAuthConfig();
  const confidential = isConfidential ?? !!config.clientSecret;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (confidential && config.clientSecret) {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
    headers["Authorization"] = `Basic ${credentials}`;
  } else {
    body.set("client_id", config.clientId);
  }

  const tokenUrl = `${config.authBaseUrl}/oauth2/token`;

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers,
      body,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      logDiagnostic("Token Exchange", res, errorData);
      
      const actionableMessage = mapOAuthError(errorData.error, errorData.error_description);
      throw new Error(actionableMessage);
    }

    return await res.json() as QfTokenResponse;
  } catch (error: any) {
    if (QF_IS_ACTIONABLE_ERROR(error.message)) {
      throw error;
    }
    
    console.error("QF OAuth: Unexpected error during token exchange:", 
      error instanceof Error ? error.name : "Unknown error"
    );
    throw new Error("Failed to exchange authorization code for tokens. Please try again.");
  }
}

/**
 * Refreshes an access token using a refresh token.
 */
export async function refreshAccessToken({ 
  refreshToken, 
  isConfidential 
}: { 
  refreshToken: string; 
  isConfidential?: boolean; 
}): Promise<QfTokenResponse> {
  const config = getQfOAuthConfig();
  const confidential = isConfidential ?? !!config.clientSecret;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (confidential && config.clientSecret) {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
    headers["Authorization"] = `Basic ${credentials}`;
  } else {
    body.set("client_id", config.clientId);
  }

  const tokenUrl = `${config.authBaseUrl}/oauth2/token`;

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers,
      body,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      logDiagnostic("Token Refresh", res, errorData);
      
      // We throw a standardized error message as per requirements
      throw new Error("Failed to refresh access token");
    }

    return await res.json() as QfTokenResponse;
  } catch (error: any) {
    if (error.message === "Failed to refresh access token") {
      throw error;
    }
    console.error("QF OAuth: Unexpected error during token refresh:", 
      error instanceof Error ? error.name : "Unknown error"
    );
    throw new Error("Failed to refresh access token");
  }
}

/**
 * Exchanges client credentials for a machine-to-machine (M2M) access token.
 */
export async function exchangeClientCredentials({ 
  scopes = ["content"] 
}: { 
  scopes?: string[] 
} = {}): Promise<QfTokenResponse> {
  const config = getQfOAuthConfig();

  if (!config.clientSecret) {
    throw new Error("Client secret is required for client_credentials grant");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: scopes.join(" "),
  });

  const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Basic ${credentials}`,
  };

  const tokenUrl = `${config.authBaseUrl}/oauth2/token`;

  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers,
      body,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      logDiagnostic("Client Credentials Exchange", res, errorData);
      throw new Error("Failed to exchange client credentials");
    }

    return await res.json() as QfTokenResponse;
  } catch (error) {
    if (error instanceof Error && error.message === "Failed to exchange client credentials") {
      throw error;
    }
    console.error("QF OAuth: Unexpected error during client credentials exchange:", 
      error instanceof Error ? error.name : "Unknown error"
    );
    throw new Error("Failed to exchange client credentials");
  }
}

/**
 * Helper to check if an error message is one of our mapped actionable messages.
 */
function QF_IS_ACTIONABLE_ERROR(message: string): boolean {
  const actionableMessages = Object.values(QF_OAUTH_ERROR_MAP);
  return actionableMessages.includes(message);
}
