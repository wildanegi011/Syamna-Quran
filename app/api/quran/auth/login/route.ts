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

        /**
         * Use NEXT_PUBLIC_URL from centralized CONFIG.
         * This avoids dynamic origin issues on Netlify while keeping it configurable.
         */
        const redirectUri = CONFIG.QURAN_FOUNDATION_REDIRECT_URI || `${CONFIG.NEXT_PUBLIC_URL}/api/quran/auth/callback`;

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