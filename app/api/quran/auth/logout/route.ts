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

    return res;
}
