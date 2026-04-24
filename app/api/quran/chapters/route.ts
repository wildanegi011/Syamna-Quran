import { NextResponse } from 'next/server';
import tokenManager from '@/lib/utils/tokenManager';
import { CONFIG } from '@/lib/api-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'id';

    // Get valid OAuth2 token from manager (server-side)
    const token = await tokenManager.getToken();

    const response = await fetch(
      `${CONFIG.QURAN_FOUNDATION_API}/chapters?language=${language}`,
      {
        headers: {
          'x-client-id': CONFIG.QURAN_FOUNDATION_CLIENT_ID,
          'x-auth-token': token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Quran Foundation API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch from Quran Foundation' },
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
