import { NextRequest, NextResponse } from "next/server";
import { exchangeAuthorizationCode } from "@/lib/qf-oauth-exchanger";
import { getQfOAuthConfig, getQfCookieName } from "@/lib/qf-oauth-config";
import { mapOAuthError } from "@/lib/qf-error-utils";
import { CONFIG } from "@/lib/api-config";

/**
 * OAuth2 Callback Handler for Quran Foundation.
 */
export async function GET(req: NextRequest) {
    const config = getQfOAuthConfig();
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // 1. Handle explicit OAuth2 errors from the provider with actionable hints
    if (error) {
        console.error(`QF OAuth [${config.env}] Provider Error:`, { error, errorDescription });
        const hint = mapOAuthError(error, errorDescription || undefined);
        return NextResponse.json(
            { error: hint },
            { status: 400 }
        );
    }

    if (!code || !state) {
        return NextResponse.json(
            { error: "Missing required callback parameters. Please try again." },
            { status: 400 }
        );
    }

    // 2. Retrieve security values from cookies
    const stateKey = getQfCookieName("oauth_state");
    const verifierKey = getQfCookieName("pkce_verifier");
    const redirectKey = getQfCookieName("oauth_redirect_uri");

    const savedState = req.cookies.get(stateKey)?.value;
    const codeVerifier = req.cookies.get(verifierKey)?.value;
    const savedRedirectUri = req.cookies.get(redirectKey)?.value;

    // 3. Security Validation
    if (!savedState || state !== savedState) {
        // Double-check: If state is missing but we already have an access token,
        // it might be a double-callback. Just redirect to the destination.
        const existingToken = req.cookies.get(getQfCookieName("access_token"))?.value;
        if (existingToken) {
            console.log("[QF Auth] State missing but access token found. Likely a double-callback. Redirecting to destination.");
            return NextResponse.redirect(new URL("/quran", CONFIG.NEXT_PUBLIC_URL));
        }

        console.error(`[QF Auth Error] State Mismatch! URL: ${state}, Cookie: ${savedState}`);
        return NextResponse.json(
            { error: "Invalid state (CSRF protected). Please try logging in again." },
            { status: 400 }
        );
    }

    if (!codeVerifier || !savedRedirectUri) {
        return NextResponse.json(
            { error: "Session expired. Please try logging in again." },
            { status: 400 }
        );
    }

    try {
        // 4. Exchange Authorization Code for Tokens
        const tokenResponse = await exchangeAuthorizationCode({
            code,
            codeVerifier,
            redirectUri: savedRedirectUri
        });

        const response = NextResponse.redirect(new URL("/quran", CONFIG.NEXT_PUBLIC_URL));

        const isProd = CONFIG.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            path: "/",
            sameSite: (isProd ? "none" : "lax") as "none" | "lax",
        };

        response.cookies.set(getQfCookieName("access_token"), tokenResponse.access_token, {
            ...cookieOptions,
            maxAge: tokenResponse.expires_in || 3600,
        });

        if (tokenResponse.refresh_token) {
            response.cookies.set(getQfCookieName("refresh_token"), tokenResponse.refresh_token, {
                ...cookieOptions,
                maxAge: 30 * 24 * 60 * 60,
            });
        }

        if (tokenResponse.id_token) {
            response.cookies.set(getQfCookieName("id_token"), tokenResponse.id_token, {
                ...cookieOptions,
                maxAge: tokenResponse.expires_in || 3600,
            });
        }

        // Set connected status and scopes for UI
        response.cookies.set(getQfCookieName("connected"), "true", {
            ...cookieOptions,
            httpOnly: false, // Allow client to read connection status if needed
            maxAge: 30 * 24 * 60 * 60,
        });

        if (tokenResponse.scope) {
            response.cookies.set(getQfCookieName("scope"), tokenResponse.scope, {
                ...cookieOptions,
                maxAge: 30 * 24 * 60 * 60,
            });
        }

        // 5. Cleanup security cookies
        response.cookies.delete(stateKey);
        response.cookies.delete(verifierKey);
        response.cookies.delete(redirectKey);
        response.cookies.delete(getQfCookieName("oauth_nonce"));

        return response;

    } catch (err: any) {
        // Catch mapped actionable errors from the exchanger
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}