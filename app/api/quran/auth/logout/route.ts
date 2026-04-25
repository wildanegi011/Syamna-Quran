import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "@/lib/api-config";

export async function GET(req: NextRequest) {
    const { origin } = new URL(req.url);
    const idToken = req.cookies.get("qf_id_token")?.value;

    // Gunakan URL produksi utama untuk post_logout_redirect_uri (sesuai permintaan user)
    const postLogoutRedirectUri = `https://syamna-quran.netlify.app`;
    
    // Endpoint logout resmi QF (berdasarkan OIDC spec)
    let logoutUrl = `${CONFIG.QURAN_FOUNDATION_OAUTH}/oauth2/sessions/logout`;
    
    if (idToken) {
        logoutUrl += `?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
    } else {
        // Jika tidak ada idToken, langsung redirect ke halaman utama
        logoutUrl = postLogoutRedirectUri;
    }

    const res = NextResponse.redirect(logoutUrl);

    // Hapus semua QF cookies (tanpa mengganggu Supabase session jika ada)
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
