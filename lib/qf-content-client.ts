import { getQfOAuthConfig } from "./qf-oauth-config";
import { exchangeClientCredentials, QfTokenResponse } from "./qf-oauth-exchanger";
import { CONFIG } from "./api-config";

/**
 * Internal manager for machine-level (Client Credentials) tokens.
 * Handles caching and proactive refresh for Content APIs.
 * 
 * Token isolation: Machine tokens are cached per environment (prelive vs production).
 */
interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

class ContentTokenManager {
  private static instance: ContentTokenManager;
  // Cache keyed by environment (e.g., "prelive", "production")
  private caches = new Map<string, CachedToken>();
  // Active refresh promises keyed by environment
  private refreshPromises = new Map<string, Promise<QfTokenResponse>>();

  private constructor() {}

  static getInstance(): ContentTokenManager {
    if (!ContentTokenManager.instance) {
      ContentTokenManager.instance = new ContentTokenManager();
    }
    return ContentTokenManager.instance;
  }

  private isTokenValid(env: string): boolean {
    const cached = this.caches.get(env);
    if (!cached) return false;
    // Buffer of 60 seconds
    return Date.now() + 60000 < cached.expiresAt;
  }

  /**
   * Retrieves a valid access token for the current environment.
   */
  async getToken(): Promise<string> {
    const config = getQfOAuthConfig();
    const env = config.env;

    if (this.isTokenValid(env)) {
      return this.caches.get(env)!.accessToken;
    }

    // Lock the refresh process for this environment
    if (!this.refreshPromises.has(env)) {
      this.refreshPromises.set(
        env, 
        exchangeClientCredentials({ scopes: ["content"] }).finally(() => {
          this.refreshPromises.delete(env);
        })
      );
    }

    const tokenData = await this.refreshPromises.get(env)!;
    this.caches.set(env, {
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    });

    return tokenData.access_token;
  }
}

/**
 * Public/Content API client helper for Quran Foundation.
 * 
 * This client uses the Client Credentials flow to authenticate machine-to-machine 
 * requests for public resources.
 */
export async function qfContentFetch(
  path: string, 
  options: RequestInit & { baseUrl?: string } = {}
): Promise<Response> {
  const config = getQfOAuthConfig();
  const tokenManager = ContentTokenManager.getInstance();
  
  // Get environment-isolated machine access token
  const accessToken = await tokenManager.getToken();
  const clientId = config.clientId;

  const headers = new Headers(options.headers || {});
  headers.set("x-auth-token", accessToken);
  headers.set("x-client-id", clientId);

  const defaultBaseUrl = CONFIG.QURAN_FOUNDATION_API || "https://api.quranfoundation.org";
  const baseUrl = options.baseUrl || defaultBaseUrl;
  
  const url = `${baseUrl}${path.startsWith("/") || !path ? path : `/${path}`}`;

  return fetch(url, {
    ...options,
    headers,
    signal: AbortSignal.timeout(30000),
  });
}
