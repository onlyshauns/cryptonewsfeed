import { NextResponse } from 'next/server';
import { getBtcChartData } from '@/lib/coingecko';
import { BtcPriceData } from '@/types';

// Simple in-memory cache
let cachedData: BtcPriceData | null = null;
let cacheTime: number | null = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET() {
  try {
    // Check if we have valid cached data
    if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // Fetch BTC price data with 24h chart
    const btcData = await getBtcChartData(1);

    // Update cache
    cachedData = btcData;
    cacheTime = Date.now();

    return NextResponse.json(btcData);
  } catch (error) {
    console.error('Error in prices API route:', error);

    // Return cached data if available
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    return NextResponse.json(
      { error: 'Failed to fetch BTC price data' },
      { status: 500 }
    );
  }
}
