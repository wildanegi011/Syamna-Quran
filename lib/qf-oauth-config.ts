import { CONFIG } from "./api-config";

/**
 * Quran Foundation OAuth2 Client Configuration
 * 
 * This module handles the configuration for the Quran Foundation OAuth2 client.
 * It strictly maps environment variables (via CONFIG) to the appropriate base URLs 
 * and ensures that required credentials are present.
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
 * Retrieves the Quran Foundation OAuth2 configuration using the centralized CONFIG.
 * Throws an error if QF_CLIENT_ID is missing.
 * 
 * @returns {QfOAuthConfig} The configuration object.
 */
export function getQfOAuthConfig(): QfOAuthConfig {
  // Use centralized CONFIG instead of raw process.env
  const clientId = CONFIG.QF_CLIENT_ID;
  const clientSecret = CONFIG.QF_CLIENT_SECRET;
  const env = (CONFIG.QF_ENV || "prelive") as QfEnv;

  if (!clientId) {
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
 */
export function getQfCookieName(baseName: string): string {
  const env = CONFIG.QF_ENV || "prelive";
  return `qf_${env}_${baseName}`;
}
