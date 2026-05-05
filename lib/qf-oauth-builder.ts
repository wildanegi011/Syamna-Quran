import { cookies } from "next/headers";
import { getQfOAuthConfig, getQfCookieName } from "./qf-oauth-config";
import { generatePkcePair, randomString } from "./pkce";
import { CONFIG } from "./api-config";

/**
 * Builds the authorization URL for Quran Foundation OAuth2 and persists
 * the state, nonce, and code verifier in secure cookies.
 * 
 * This function handles the generation of PKCE values and state/nonce for CSRF protection.
 * It MUST be called within a server context (Route Handler or Server Action) to persist cookies.
 * 
 * @param redirectUri - The URI to redirect back to after authorization.
 * @param scopes - Optional array of scopes to request.
 * @returns An object containing the generated URL, state, and nonce.
 */
export async function buildAuthorizationUrl({
  redirectUri,
  scopes = [
    "openid",
    "offline_access",
    "content",
    "bookmark",
    "collection",
    "activity_day",
    "streak",
    "user"
  ]
}: {
  redirectUri: string;
  scopes?: string[];
}) {
  const config = getQfOAuthConfig();

  // Generate PKCE and security values
  const { codeVerifier, codeChallenge } = generatePkcePair();
  const state = randomString(16);
  const nonce = randomString(16);

  // Construct the authorization URL
  const url = new URL(`${config.authBaseUrl}/oauth2/auth`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  // Persist the sensitive values in secure, httpOnly cookies server-side
  // We use environment-prefixed cookie names to ensure token isolation.
  const cookieStore = await cookies();
  const isProd = CONFIG.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd, // Must be true for sameSite: "none"
    path: "/",
    maxAge: 600, // 10 minutes
    sameSite: "none" as const,
  };

  cookieStore.set(getQfCookieName("pkce_verifier"), codeVerifier, cookieOptions);
  cookieStore.set(getQfCookieName("oauth_state"), state, cookieOptions);
  cookieStore.set(getQfCookieName("oauth_nonce"), nonce, cookieOptions);
  cookieStore.set(getQfCookieName("oauth_redirect_uri"), redirectUri, cookieOptions);

  return {
    url: url.toString(),
    state,
    nonce
  };
}
