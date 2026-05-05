/**
 * Quran Foundation OAuth2 Client Configuration
 * 
 * This module handles the configuration for the Quran Foundation OAuth2 client.
 * It strictly maps environment variables to the appropriate base URLs and ensures
 * that required credentials are present.
 * 
 * Integration Type: Confidential Client
 * (Using frontend/native app + backend exchange pattern)
 */

export type QfEnv = "prelive" | "production";

export interface QfOAuthConfig {
  env: QfEnv;
  clientId: string;
  clientSecret?: string;
  authBaseUrl: string;
  apiBaseUrl: string;
}

const ENV_CONFIGS: Record<QfEnv, { authBaseUrl: string; apiBaseUrl: string }> = {
  prelive: {
    authBaseUrl: "https://prelive-oauth2.quran.foundation",
    apiBaseUrl: "https://apis-prelive.quran.foundation",
  },
  production: {
    authBaseUrl: "https://oauth2.quran.foundation",
    apiBaseUrl: "https://apis.quran.foundation",
  },
};

/**
 * Retrieves the Quran Foundation OAuth2 configuration.
 * Throws an error if QF_CLIENT_ID is missing.
 * 
 * @returns {QfOAuthConfig} The configuration object.
 * @throws {Error} If QF_CLIENT_ID is missing.
 */
export function getQfOAuthConfig(): QfOAuthConfig {
  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;
  const env = (process.env.QF_ENV || "prelive") as QfEnv;

  if (!clientId) {
    // Exact error message as required
    throw new Error(
      "Missing Quran Foundation API credentials. Request access: https://api-docs.quran.foundation/request-access"
    );
  }

  const config = ENV_CONFIGS[env] || ENV_CONFIGS.prelive;

  return {
    env,
    clientId,
    clientSecret,
    authBaseUrl: config.authBaseUrl,
    apiBaseUrl: config.apiBaseUrl,
  };
}

/**
 * Returns a cookie name prefixed with the current environment
 * to ensure token isolation between prelive and production.
 * 
 * @param baseName - The base name of the cookie (e.g., "access_token")
 * @returns The environment-prefixed cookie name.
 */
export function getQfCookieName(baseName: string): string {
  const env = process.env.QF_ENV || "prelive";
  return `qf_${env}_${baseName}`;
}
