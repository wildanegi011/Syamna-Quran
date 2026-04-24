import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "@/lib/api-config";

/**
 * Proxy untuk Quran Foundation User APIs
 * Route: /api/quran/user/[...path]
 * Contoh: /api/quran/user/bookmarks → https://apis.quran.foundation/auth/v1/bookmarks
 *
 * Membaca access_token dari httpOnly cookie dan meneruskan sebagai
 * x-auth-token header ke Quran Foundation.
 */

// Base URL untuk User APIs (berbeda dari Content APIs)
const QF_USER_API_BASE = CONFIG.QURAN_FOUNDATION_API.replace(
    "/content/api/v4",
    "/auth/v1"
);

async function refreshAccessToken(
    refreshToken: string
): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
} | null> {
    const credentials = Buffer.from(
        `${CONFIG.QURAN_FOUNDATION_CLIENT_ID}:${CONFIG.QURAN_FOUNDATION_CLIENT_SECRET}`
    ).toString("base64");

    try {
        const res = await fetch(
            `${CONFIG.QURAN_FOUNDATION_OAUTH}/oauth2/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${credentials}`,
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                }),
            }
        );

        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

async function proxyRequest(
    req: NextRequest,
    path: string[],
    accessToken: string
) {
    const { searchParams } = new URL(req.url);
    const externalPath = path.join("/");
    const targetUrl = `${QF_USER_API_BASE}/${externalPath}?${searchParams.toString()}`;

    const headers: Record<string, string> = {
        "x-auth-token": accessToken,
        "x-client-id": CONFIG.QURAN_FOUNDATION_CLIENT_ID,
    };

    // Forward Content-Type dan body untuk POST/PUT/PATCH/DELETE
    const method = req.method;
    let body: string | undefined;

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        const contentType = req.headers.get("content-type");
        if (contentType) {
            headers["Content-Type"] = contentType;
        }
        body = await req.text();
    }

    const response = await fetch(targetUrl, {
        method,
        headers,
        body,
        signal: AbortSignal.timeout(30000),
    });

    return response;
}

async function handleRequest(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const accessToken = req.cookies.get("qf_access_token")?.value;
    const refreshToken = req.cookies.get("qf_refresh_token")?.value;

    if (!accessToken) {
        return NextResponse.json(
            { error: "Not connected to Quran Foundation. Please connect your account first." },
            { status: 401 }
        );
    }

    try {
        // Pertama, coba dengan access_token yang ada
        let response = await proxyRequest(req, path, accessToken);

        // Jika 401, coba refresh token
        if (response.status === 401 && refreshToken) {
            const newTokens = await refreshAccessToken(refreshToken);

            if (newTokens) {
                // Retry dengan token baru
                response = await proxyRequest(req, path, newTokens.access_token);

                if (response.ok) {
                    const data = await response.json();
                    const res = NextResponse.json(data);

                    // Update cookies dengan token baru
                    const cookieOptions = {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        path: "/",
                        sameSite: "lax" as const,
                    };

                    res.cookies.set("qf_access_token", newTokens.access_token, {
                        ...cookieOptions,
                        maxAge: newTokens.expires_in || 3600,
                    });

                    if (newTokens.refresh_token) {
                        res.cookies.set("qf_refresh_token", newTokens.refresh_token, {
                            ...cookieOptions,
                            maxAge: 30 * 24 * 60 * 60,
                        });
                    }

                    const expiresAt =
                        Date.now() + (newTokens.expires_in || 3600) * 1000;
                    res.cookies.set("qf_expires_at", expiresAt.toString(), {
                        ...cookieOptions,
                        httpOnly: false,
                        maxAge: newTokens.expires_in || 3600,
                    });

                    return res;
                }
            }

            // Refresh gagal — user harus reconnect
            return NextResponse.json(
                { error: "Session expired. Please reconnect your Quran Foundation account." },
                { status: 401 }
            );
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                {
                    error: `Quran Foundation API error`,
                    details: errorData,
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("QF User API Proxy Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Support semua HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
