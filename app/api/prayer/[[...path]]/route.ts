import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/api-config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path } = await params;
    const { searchParams } = new URL(request.url);
    
    // Base URL: https://equran.id/api/v2/shalat
    const subPath = path ? `/${path.join('/')}` : '';
    const targetUrl = `${CONFIG.EQURAN_API}/v2/shalat${subPath}?${searchParams.toString()}`;

    const response = await fetch(targetUrl);

    if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch from Prayer API` },
          { status: response.status }
        );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Prayer API GET Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path } = await params;
    const body = await request.json();
    
    // Base URL: https://equran.id/api/v2/shalat
    const subPath = path ? `/${path.join('/')}` : '';
    const targetUrl = `${CONFIG.EQURAN_API}/v2/shalat${subPath}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to post to Prayer API` },
          { status: response.status }
        );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Prayer API POST Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
