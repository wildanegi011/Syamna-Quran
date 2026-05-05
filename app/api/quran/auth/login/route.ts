import { NextResponse } from "next/server";
import { buildAuthorizationUrl } from "@/lib/qf-oauth-builder";
import { getQfOAuthConfig } from "@/lib/qf-oauth-config";

/**
 * GET handler for initiating the Quran Foundation OAuth2 login flow.
 * It builds the authorization URL with PKCE and redirects the user.
 */
export async function GET() {
    try {
        // Ensure configuration is valid
        getQfOAuthConfig();
        
        const redirectUri = process.env.QURAN_FOUNDATION_REDIRECT_URI || "";
        
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