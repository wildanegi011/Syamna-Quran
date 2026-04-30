import { NextResponse } from "next/server";
import { generatePkcePair, randomString } from "@/lib/pkce";
import { CONFIG } from "@/lib/api-config";

export async function GET() {
    const { codeVerifier, codeChallenge } = generatePkcePair();
    const state = randomString(16);
    const nonce = randomString(16);

    // Scopes optimized for Quran Foundation usage
    // Standard OIDC scopes (openid, profile, email) are required for full user data in id_token
    const scopes = [
        "openid",
        "offline_access",
        "content",
        // "search",
        "bookmark",
        "collection",
        // "reading_session",
        // "preference",
        "activity_day",
        // "goal",
        "streak",
        "user"
        // "post",`
        // "comment",
        // "room",
        // "tag",
        // "note"
    ].join(" ");

    const url = new URL(`${CONFIG.QURAN_FOUNDATION_OAUTH}/oauth2/auth`);

    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", CONFIG.QURAN_FOUNDATION_CLIENT_ID);
    url.searchParams.set("redirect_uri", CONFIG.QURAN_FOUNDATION_REDIRECT_URI);
    url.searchParams.set("scope", scopes);
    url.searchParams.set("state", state);
    url.searchParams.set("nonce", nonce);
    url.searchParams.set("prompt", "login");
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");

    console.log("QF OAuth Login URL:", url.toString());
    const res = NextResponse.redirect(url.toString());

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 600, // 10 minutes for temporary auth state
        sameSite: "none" as const,
    };

    // Store PKCE and OAuth state in secure cookies for callback validation
    res.cookies.set("qf_pkce_verifier", codeVerifier, cookieOptions);
    res.cookies.set("qf_oauth_state", state, cookieOptions);
    res.cookies.set("qf_oauth_nonce", nonce, cookieOptions);

    return res;
}