import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/quran/status
 * Cek apakah user sudah terkoneksi ke Quran Foundation.
 * Mengembalikan status connected dan user info dari id_token.
 */
export async function GET(req: NextRequest) {
    const accessToken = req.cookies.get("qf_access_token")?.value;
    const idToken = req.cookies.get("qf_id_token")?.value;
    const connected = req.cookies.get("qf_connected")?.value === "true";

    if (!connected || !accessToken) {
        return NextResponse.json({
            connected: false,
            user: null,
        });
    }

    // Decode id_token (JWT) tanpa verify signature
    // (signature sudah diverifikasi oleh Hydra saat token exchange)
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

    const scopeStr = req.cookies.get("qf_scope")?.value || "";
    const scopes = scopeStr ? scopeStr.split(" ") : [];

    return NextResponse.json({
        connected: true,
        user,
        scopes,
    });
}
