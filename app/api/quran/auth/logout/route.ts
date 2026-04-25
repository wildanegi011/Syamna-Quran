import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "@/lib/api-config";

export async function GET(req: NextRequest) {
    const idToken = req.cookies.get("qf_id_token")?.value;
    const postLogoutRedirectUri = `https://syamna-quran.netlify.app`;
    
    // RP-Initiated Logout URL according to OIDC spec
    let logoutUrl = `${CONFIG.QURAN_FOUNDATION_OAUTH}/oauth2/sessions/logout`;
    
    if (idToken) {
        const params = new URLSearchParams({
            id_token_hint: idToken,
            post_logout_redirect_uri: postLogoutRedirectUri,
            client_id: CONFIG.QURAN_FOUNDATION_CLIENT_ID
        });
        logoutUrl += `?${params.toString()}`;
    } else {
        logoutUrl = postLogoutRedirectUri;
    }

    const res = NextResponse.redirect(logoutUrl);

    // Clear all app cookies related to Quran Foundation
    const qfCookies = [
        "qf_access_token",
        "qf_refresh_token",
        "qf_id_token",
        "qf_expires_at",
        "qf_connected",
        "qf_pkce_verifier",
        "qf_oauth_state",
        "qf_oauth_nonce",
    ];

    for (const name of qfCookies) {
        res.cookies.delete(name);
    }

    return res;
}
