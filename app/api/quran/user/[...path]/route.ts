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

// Base URLs untuk User APIs (menggunakan consolidated proxy apis-prelive)
const QF_AUTH_API_BASE = "https://apis-prelive.quran.foundation/auth/v1";
const QF_REFLECT_API_BASE = "https://apis-prelive.quran.foundation/quran-reflect/v1";
const QF_USERINFO_BASE = "https://prelive-oauth2.quran.foundation/userinfo";

// Global refresh promise to prevent race conditions during parallel requests
let refreshPromise: Promise<any> | null = null;

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
    accessToken: string,
    reqBody?: string
) {
    const { searchParams } = new URL(req.url);
    let externalPath = path.join("/");

    // Tentukan Base URL berdasarkan path setelah mapping
    let baseUrl = QF_AUTH_API_BASE;
    let isUserInfo = false;

    // Mapping khusus untuk profile -> OIDC UserInfo
    if (externalPath === "profile") {
        baseUrl = QF_USERINFO_BASE;
        externalPath = ""; // Path kosong karena baseUrl sudah mengarah ke endpointnya
        isUserInfo = true;
    } else if (externalPath.startsWith("users/profile") || externalPath.startsWith("posts") || externalPath.startsWith("tadabburs")) {
        baseUrl = QF_REFLECT_API_BASE;
    }

    const targetUrl = externalPath 
        ? `${baseUrl}/${externalPath}?${searchParams.toString()}`
        : `${baseUrl}?${searchParams.toString()}`;

    const headers: Record<string, string> = {
        "Accept": isUserInfo ? "application/json" : "application/vnd.qf.v1+json, application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-auth-token": accessToken,
        "x-client-id": CONFIG.QURAN_FOUNDATION_CLIENT_ID,
        "x-timezone": "Asia/Jakarta",
    };

    // Forward Content-Type dan body untuk POST/PUT/PATCH/DELETE
    const method = req.method;
    let body: string | undefined;

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        const contentType = req.headers.get("content-type");
        if (contentType) {
            headers["Content-Type"] = contentType;
        }
        body = reqBody;
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
        let reqBody: string | undefined;
        if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
            reqBody = await req.text();
        }

        // Cek apakah token hampir habis (misal sisa 30 detik) untuk proactive refresh
        const expiresAt = req.cookies.get("qf_expires_at")?.value;
        const needsProactiveRefresh = expiresAt && (Date.now() + 30000 > parseInt(expiresAt));

        // Pertama, coba dengan access_token yang ada
        let currentToken = accessToken;
        let response = await proxyRequest(req, path, currentToken, reqBody);

        const isTokenExpired = async (res: Response) => {
            if (res.status === 401 || res.status === 403) return true;
            try {
                const clone = res.clone();
                const body = await clone.json();
                return body?.message?.includes("expired") || body?.type === "invalid_token";
            } catch { return false; }
        };

        if ((needsProactiveRefresh || await isTokenExpired(response)) && refreshToken) {
            // Gunakan refreshPromise global untuk mengunci proses refresh agar tidak double-hit
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken(refreshToken).finally(() => {
                    refreshPromise = null;
                });
            }

            const newTokens = await refreshPromise;

            if (newTokens) {
                // Retry dengan token baru
                response = await proxyRequest(req, path, newTokens.access_token, reqBody);

                if (response.ok || !(await isTokenExpired(response))) {
                    const data = await response.json().catch(() => ({}));
                    const res = NextResponse.json(data);

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

                    const newExpiresAt = Date.now() + (newTokens.expires_in || 3600) * 1000;
                    res.cookies.set("qf_expires_at", newExpiresAt.toString(), {
                        ...cookieOptions,
                        httpOnly: false,
                        maxAge: newTokens.expires_in || 3600,
                    });

                    return res;
                }
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Jika refresh tetap gagal atau token ditolak total
            if (response.status === 401 || response.status === 403) {
                return NextResponse.json(
                    { error: "Session expired. Please reconnect your Quran Foundation account." },
                    { status: 401 }
                );
            }

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
