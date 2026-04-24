import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "@/lib/api-config";

export async function GET(req: NextRequest) {
    const { origin } = new URL(req.url);
    const idToken = req.cookies.get("qf_id_token")?.value;

    const res = NextResponse.redirect(`${origin}/quran`);

    // Hapus semua QF cookies (tanpa mengganggu Supabase session)
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

    // Jika ada id_token, redirect ke QF logout endpoint juga
    // agar session di Quran Foundation juga dihapus
    if (idToken) {
        const logoutParams = new URLSearchParams({
            post_logout_redirect_uri: `https://syamna-quran.netlify.app/quran`,
            id_token_hint: idToken,
        });

        return NextResponse.redirect(
            `${CONFIG.QURAN_FOUNDATION_OAUTH}/oauth2/sessions/logout?${logoutParams}`
        );
    }

    return res;
}
