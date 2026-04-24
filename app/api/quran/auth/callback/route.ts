import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "@/lib/api-config";

export async function GET(req: NextRequest) {
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");

    // Ambil values yang disimpan saat login
    const storedState = req.cookies.get("qf_oauth_state")?.value;
    const verifier = req.cookies.get("qf_pkce_verifier")?.value;

    // --- Validasi ---

    // 1. Validasi state (CSRF protection)
    if (!returnedState || !storedState || returnedState !== storedState) {
        console.error("QF OAuth: State mismatch — possible CSRF attack");
        return NextResponse.redirect(
            `${origin}/quran?error=oauth_state_mismatch`
        );
    }

    // 2. Validasi code & verifier ada
    if (!code) {
        console.error("QF OAuth: Missing code from provider");
        return NextResponse.redirect(`${origin}/quran?error=oauth_missing_code`);
    }

    if (!verifier) {
        console.error("QF OAuth: Missing verifier from cookies");
        return NextResponse.redirect(`${origin}/quran?error=oauth_missing_verifier`);
    }

    // --- Token Exchange ---
    // Confidential client: gunakan Basic Auth (client_id:client_secret)
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
            return NextResponse.redirect(
                `${origin}/quran?error=oauth_token_exchange_failed`
            );
        }

        const data = await tokenRes.json();

        // --- Simpan tokens di httpOnly cookies ---
        const res = NextResponse.redirect(`${origin}/quran`);

        const secureCookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax" as const,
        };

        // Access token — set maxAge sesuai expires_in
        res.cookies.set("qf_access_token", data.access_token, {
            ...secureCookieOptions,
            maxAge: data.expires_in || 3600,
        });

        // Refresh token — long-lived
        if (data.refresh_token) {
            res.cookies.set("qf_refresh_token", data.refresh_token, {
                ...secureCookieOptions,
                maxAge: 30 * 24 * 60 * 60, // 30 hari
            });
        }

        // ID token — untuk user info (sub, email)
        if (data.id_token) {
            res.cookies.set("qf_id_token", data.id_token, {
                ...secureCookieOptions,
                maxAge: data.expires_in || 3600,
            });
        }

        // Simpan expires_at untuk frontend
        const expiresAt = Date.now() + (data.expires_in || 3600) * 1000;
        res.cookies.set("qf_expires_at", expiresAt.toString(), {
            ...secureCookieOptions,
            httpOnly: false, // Frontend perlu baca ini
            maxAge: data.expires_in || 3600,
        });

        // Simpan flag connected (readable by frontend)
        res.cookies.set("qf_connected", "true", {
            ...secureCookieOptions,
            httpOnly: false, // Frontend perlu baca ini
            maxAge: 30 * 24 * 60 * 60, // 30 hari
        });

        // Cleanup temporary cookies
        res.cookies.delete("qf_pkce_verifier");
        res.cookies.delete("qf_oauth_state");
        res.cookies.delete("qf_oauth_nonce");

        return res;
    } catch (error) {
        console.error("QF OAuth: Unexpected error during token exchange:", error);
        return NextResponse.redirect(
            `${origin}/quran?error=oauth_unexpected_error`
        );
    }
}