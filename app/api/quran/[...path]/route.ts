import { NextResponse } from 'next/server';
import tokenManager from '@/lib/utils/tokenManager';
import { CONFIG } from '@/lib/api-config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const { searchParams } = new URL(request.url);

    // Get valid OAuth2 token from manager (server-side)
    let token;
    try {
      token = await tokenManager.getToken();
    } catch (tokenError) {
      console.error('Failed to get OAuth token for Quran Foundation:', tokenError);
      return NextResponse.json(
        { 
          error: 'Authentication Failure', 
          message: 'Failed to acquire access token for Quran Foundation',
          details: tokenError instanceof Error ? tokenError.message : String(tokenError)
        },
        { status: 502 } // Bad Gateway - upstream auth failed
      );
    }

    // Map internal path to external QF path
    const externalPath = path.join('/');
    const targetUrl = `${CONFIG.QURAN_FOUNDATION_API}/${externalPath}?${searchParams.toString()}`;

    const response = await fetch(targetUrl, {
      headers: {
        'x-client-id': CONFIG.QURAN_FOUNDATION_CLIENT_ID,
        'x-auth-token': token,
      },
      // Set a reasonable timeout for the target API as well
      signal: AbortSignal.timeout(30000), 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Quran Foundation API Error [${externalPath}]:`, errorData);
      return NextResponse.json(
        { 
          error: `Failed to fetch ${externalPath} from Quran Foundation`,
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
