import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "@/lib/api-config";
import { getQfCookieName } from "@/lib/qf-oauth-config";

/**
 * Logout handler for Quran Foundation.
 * Clears environment-isolated cookies and redirects to the provider's logout endpoint.
 */
export async function GET(req: NextRequest) {
    // Use environment-isolated cookie names
    const idTokenKey = getQfCookieName("id_token");
    const idToken = req.cookies.get(idTokenKey)?.value;
    const postLogoutRedirectUri = CONFIG.NEXT_PUBLIC_URL;
    
    // RP-Initiated Logout URL
    let logoutUrl = `${CONFIG.QURAN_FOUNDATION_OAUTH}/oauth2/sessions/logout`;
    
    if (idToken) {
        const params = new URLSearchParams({
            id_token_hint: idToken,
            post_logout_redirect_uri: postLogoutRedirectUri,
            client_id: CONFIG.QF_CLIENT_ID // Use isolated client ID
        });
        logoutUrl += `?${params.toString()}`;
    } else {
        logoutUrl = postLogoutRedirectUri;
    }

    const res = NextResponse.redirect(new URL(logoutUrl, req.url));

    // Clear all environment-isolated cookies related to Quran Foundation
    const qfCookieBases = [
        "access_token",
        "refresh_token",
        "id_token",
        "expires_at",
        "connected",
        "pkce_verifier",
        "oauth_state",
        "oauth_nonce",
        "oauth_redirect_uri"
    ];

    for (const baseName of qfCookieBases) {
        res.cookies.delete(getQfCookieName(baseName));
    }

    return res;
}
