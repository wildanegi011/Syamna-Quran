import { NextRequest, NextResponse } from "next/server";
import { buildAuthorizationUrl } from "@/lib/qf-oauth-builder";
import { getQfOAuthConfig } from "@/lib/qf-oauth-config";
import { CONFIG } from "@/lib/api-config";

/**
 * GET handler for initiating the Quran Foundation OAuth2 login flow.
 */
export async function GET(req: NextRequest) {
    try {
        // Ensure configuration is valid
        getQfOAuthConfig();

        // Build a dynamic redirect URI based on the current host if not explicitly set
        // This ensures it works correctly on local (ngrok) and production (Netlify)
        const host = req.headers.get("host");
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const origin = `${protocol}://${host}`;

        const redirectUri = CONFIG.QURAN_FOUNDATION_REDIRECT_URI || `${origin}/api/quran/auth/callback`;

        console.log(`[QF Auth] Initiating login with redirect_uri: ${redirectUri}`);

        // Build the URL and persist PKCE/state/nonce in secure cookies
        const { url } = await buildAuthorizationUrl({
            redirectUri
        });

        // Redirect to the authorization endpoint
        return NextResponse.redirect(url);
    } catch (error: any) {
        console.error("QF OAuth Login Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to initiate login flow" },
            { status: 500 }
        );
    }
}