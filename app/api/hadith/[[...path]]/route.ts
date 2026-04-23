import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/api-config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path } = await params;
    const { searchParams } = new URL(request.url);
    
    // Base URL: https://hadeethenc.com/api/v1
    const subPath = path ? `/${path.join('/')}` : '';
    const targetUrl = `${CONFIG.HADIST_API}${subPath}?${searchParams.toString()}`;

    const response = await fetch(targetUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from Hadith API` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Hadith API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
