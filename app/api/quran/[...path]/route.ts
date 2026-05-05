import { NextResponse } from 'next/server';
import { qfContentFetch } from '@/lib/qf-content-client';

/**
 * Proxy for Quran Foundation Content APIs
 * Route: /api/quran/[...path]
 * 
 * This route proxies requests for public Quran data (chapters, verses, etc.)
 * using machine-level authentication (Client Credentials).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const { searchParams } = new URL(request.url);

    // Construct the external path from the catch-all parameters
    const externalPath = path.join('/');
    const queryStr = searchParams.toString();
    const targetPath = queryStr ? `${externalPath}?${queryStr}` : externalPath;

    // Use qfContentFetch which handles token management automatically
    const response = await qfContentFetch(targetPath, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Quran Foundation Content API Error [${externalPath}]:`, errorData);
      
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
  } catch (error: any) {
    console.error('Quran Content API Proxy Error:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
