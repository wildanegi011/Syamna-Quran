import { NextRequest, NextResponse } from "next/server";
import { getQfCookieName } from "@/lib/qf-oauth-config";

/**
 * GET /api/quran/auth/status
 * Cek apakah user sudah terkoneksi ke Quran Foundation.
 * Mengembalikan status connected dan user info dari id_token.
 */
export async function GET(req: NextRequest) {
    // Use environment-isolated cookie names
    const accessToken = req.cookies.get(getQfCookieName("access_token"))?.value;
    const idToken = req.cookies.get(getQfCookieName("id_token"))?.value;
    
    // Fallback: if we have an access token, we are effectively connected
    const connectedCookie = req.cookies.get(getQfCookieName("connected"))?.value;
    const connected = connectedCookie === "true" || !!accessToken;

    if (!connected || !accessToken) {
        return NextResponse.json({
            connected: false,
            user: null,
        });
    }

    // Decode id_token (JWT) tanpa verify signature
    let user = null;
    if (idToken) {
        try {
            const payload = idToken.split(".")[1];
            const decoded = JSON.parse(
                Buffer.from(payload, "base64").toString("utf-8")
            );
            user = {
                sub: decoded.sub,
                email: decoded.email,
                firstName: decoded.first_name,
                lastName: decoded.last_name,
                picture: decoded.picture,
            };
        } catch {
            // Gagal decode — tidak fatal
        }
    }

    const scopeStr = req.cookies.get(getQfCookieName("scope"))?.value || "";
    const scopes = scopeStr ? scopeStr.split(" ") : [];

    return NextResponse.json({
        connected: true,
        user,
        scopes,
    });
}
