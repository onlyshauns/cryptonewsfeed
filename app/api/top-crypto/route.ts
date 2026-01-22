import { NextResponse } from 'next/server';
import { getTopCryptos } from '@/lib/coingecko';
import { TopCryptoResponse } from '@/types';

// Simple in-memory cache
let cachedData: TopCryptoResponse | null = null;
let cacheTime: number | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET() {
  try {
    // Check if we have valid cached data
    if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // Fetch top 10 cryptocurrencies with sparkline data
    const cryptos = await getTopCryptos(10);

    const response: TopCryptoResponse = { cryptos };

    // Update cache
    cachedData = response;
    cacheTime = Date.now();

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in top-crypto API route:', error);

    // Return cached data if available
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    return NextResponse.json(
      { error: 'Failed to fetch top crypto data', cryptos: [] },
      { status: 500 }
    );
  }
}
