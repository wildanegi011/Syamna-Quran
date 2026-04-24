import { NextResponse } from "next/server";
import {
    generateCodeVerifier,
    generateCodeChallenge,
    generateState,
    generateNonce,
} from "@/lib/pkce";
import { CONFIG } from "@/lib/api-config";

export async function GET() {
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    const state = generateState();
    const nonce = generateNonce();

    const scopes = [
        "openid",
        "offline_access",
        "bookmark",
        "collection",
        "reading_session",
        "preference",
        "goal",
        "streak",
        "user",
    ].join(" ");

    const url = new URL(
        `${CONFIG.QURAN_FOUNDATION_OAUTH}/oauth2/auth`
    );

    url.searchParams.set("client_id", CONFIG.QURAN_FOUNDATION_CLIENT_ID);
    url.searchParams.set("redirect_uri", CONFIG.QURAN_FOUNDATION_REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", scopes);
    url.searchParams.set("state", state);
    url.searchParams.set("nonce", nonce);
    url.searchParams.set("code_challenge", challenge);
    url.searchParams.set("code_challenge_method", "S256");

    const res = NextResponse.redirect(url.toString());

    // Simpan PKCE verifier, state, dan nonce di httpOnly cookies
    // Cookies ini akan divalidasi/dipakai di callback route
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 600, // 10 menit — cukup untuk login flow
        sameSite: "lax" as const,
    };

    res.cookies.set("qf_pkce_verifier", verifier, cookieOptions);
    res.cookies.set("qf_oauth_state", state, cookieOptions);
    res.cookies.set("qf_oauth_nonce", nonce, cookieOptions);

    return res;
}