import { NextRequest, NextResponse } from "next/server";
import { getQfOAuthConfig } from "@/lib/qf-oauth-config";
import { qfFetch } from "@/lib/qf-api-client";

/**
 * Proxy for Quran Foundation User APIs
 * Route: /api/quran/user/[...path]
 *
 * This route uses qfFetch to handle authenticated requests to Quran Foundation User APIs.
 * It automatically handles header injection and token refresh.
 */

async function handleRequest(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const config = getQfOAuthConfig();
    const { searchParams } = new URL(req.url);
    let externalPath = path.join("/");

    // 1. Determine the appropriate Base URL and Path mapping
    let baseUrl: string | undefined;
    let acceptHeader = "application/vnd.qf.v1+json, application/json";

    if (externalPath === "profile") {
        // Mapping for OIDC UserInfo
        baseUrl = `${config.authBaseUrl}/userinfo`;
        externalPath = ""; 
        acceptHeader = "application/json";
    } else if (
        externalPath.startsWith("users/profile") || 
        externalPath.startsWith("posts") || 
        externalPath.startsWith("tadabburs")
    ) {
        // Mapping for Quran Reflect APIs
        baseUrl = `${config.apiBaseUrl}/quran-reflect/v1`;
    }

    try {
        // 2. Prepare the request body for mutation methods
        let reqBody: string | undefined;
        if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
            reqBody = await req.text();
        }

        // 3. Construct the target path with query parameters
        const queryStr = searchParams.toString();
        const targetPath = queryStr ? `${externalPath}?${queryStr}` : externalPath;

        // 4. Perform the authenticated request via qfFetch
        const response = await qfFetch(targetPath, {
            method: req.method,
            baseUrl,
            body: reqBody,
            headers: {
                "Accept": acceptHeader,
                ...(req.headers.get("content-type") ? { "Content-Type": req.headers.get("content-type")! } : {}),
                "x-timezone": "Asia/Jakarta",
            }
        });

        // 5. Handle terminal failures (e.g., refresh failed or token revoked)
        if (!response.ok && response.status === 401) {
             return NextResponse.json(
                { error: "Session expired. Please reconnect your Quran Foundation account." },
                { status: 401 }
            );
        }

        // 6. Forward the response to the client
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
        
    } catch (error: any) {
        console.error("QF User API Proxy Error:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}

// Support all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
