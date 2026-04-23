import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/api-config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Base URL: https://equran.id/api/v2/tafsir
    const targetUrl = `${CONFIG.EQURAN_API}/v2/tafsir/${id}`;

    const response = await fetch(targetUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch from Tafsir API` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Tafsir API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
