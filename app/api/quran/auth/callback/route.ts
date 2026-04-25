import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "@/lib/api-config";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const providerError = searchParams.get("error");
    const providerErrorDesc = searchParams.get("error_description");

    const baseUrl = "https://syamna-quran.netlify.app/quran";

    // Handle provider errors
    if (providerError) {
        console.error("QF OAuth Provider Error:", providerError, providerErrorDesc);
        return NextResponse.redirect(`${baseUrl}?error=provider_error&detail=${encodeURIComponent(providerError)}`);
    }

    const storedState = req.cookies.get("qf_oauth_state")?.value;
    const verifier = req.cookies.get("qf_pkce_verifier")?.value;

    // 1. Handle double-redirects (already connected)
    const alreadyConnected = req.cookies.get("qf_connected")?.value === "true";
    if (alreadyConnected && (!returnedState || !storedState)) {
        return NextResponse.redirect(baseUrl);
    }

    // 2. Validate state (CSRF protection)
    if (!returnedState || !storedState || returnedState !== storedState) {
        console.error("QF OAuth: State mismatch");
        return NextResponse.redirect(`${baseUrl}?error=oauth_state_mismatch`);
    }

    // 3. Validate code and PKCE verifier
    if (!code || !verifier) {
        console.error("QF OAuth: Missing code or verifier");
        return NextResponse.redirect(`${baseUrl}?error=oauth_invalid_request`);
    }

    // --- Token Exchange ---
    const credentials = Buffer.from(
        `${CONFIG.QURAN_FOUNDATION_CLIENT_ID}:${CONFIG.QURAN_FOUNDATION_CLIENT_SECRET}`
    ).toString("base64");

    try {
        const tokenRes = await fetch(
            `${CONFIG.QURAN_FOUNDATION_OAUTH}/oauth2/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${credentials}`,
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: CONFIG.QURAN_FOUNDATION_REDIRECT_URI,
                    code_verifier: verifier,
                }),
            }
        );

        if (!tokenRes.ok) {
            const errorData = await tokenRes.json().catch(() => ({}));
            console.error("QF OAuth: Token exchange failed:", errorData);
            return NextResponse.redirect(`${baseUrl}?error=oauth_token_exchange_failed`);
        }

        const data = await tokenRes.json();
        const res = NextResponse.redirect(baseUrl);
        const secureCookieOptions = {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "none" as const,
        };

        // Persist tokens in secure httpOnly cookies
        res.cookies.set("qf_access_token", data.access_token, {
            ...secureCookieOptions,
            maxAge: data.expires_in || 3600,
        });

        if (data.refresh_token) {
            res.cookies.set("qf_refresh_token", data.refresh_token, {
                ...secureCookieOptions,
                maxAge: 30 * 24 * 60 * 60, // 30 days
            });
        }

        if (data.id_token) {
            res.cookies.set("qf_id_token", data.id_token, {
                ...secureCookieOptions,
                maxAge: data.expires_in || 3600,
            });
        }

        // Expose connection state and expiry to the frontend
        const expiresAt = Date.now() + (data.expires_in || 3600) * 1000;
        res.cookies.set("qf_expires_at", expiresAt.toString(), {
            ...secureCookieOptions,
            httpOnly: false,
            maxAge: data.expires_in || 3600,
        });

        res.cookies.set("qf_connected", "true", {
            ...secureCookieOptions,
            httpOnly: false,
            maxAge: 30 * 24 * 60 * 60,
        });

        // Cleanup temporary auth cookies
        res.cookies.delete("qf_pkce_verifier");
        res.cookies.delete("qf_oauth_state");
        res.cookies.delete("qf_oauth_nonce");

        return res;
    } catch (error) {
        console.error("QF OAuth: Unexpected error:", error);
        return NextResponse.redirect(`${baseUrl}?error=oauth_unexpected_error`);
    }
}