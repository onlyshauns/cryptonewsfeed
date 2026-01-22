import axios from 'axios';
import { CryptoPrice, BtcPriceData, ChartDataPoint } from '@/types';

const COINGECKO_API_BASE = process.env.NEXT_PUBLIC_COINGECKO_API || 'https://api.coingecko.com/api/v3';

/**
 * Get current prices for specified coin IDs
 */
export async function getCurrentPrices(coinIds: string[]): Promise<Record<string, number>> {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/simple/price`, {
      params: {
        ids: coinIds.join(','),
        vs_currencies: 'usd',
        include_24hr_change: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current prices from CoinGecko:', error);
    throw error;
  }
}

/**
 * Get top cryptocurrencies by market cap with sparkline data
 */
export async function getTopCryptos(limit: number = 5): Promise<CryptoPrice[]> {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
    });

    return response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      sparkline: coin.sparkline_in_7d?.price || [],
    }));
  } catch (error) {
    console.error('Error fetching top cryptos from CoinGecko:', error);
    throw error;
  }
}

/**
 * Get BTC price chart data for the past N days
 */
export async function getBtcChartData(days: number = 1): Promise<BtcPriceData> {
  try {
    // Get current price and 24h change
    const priceResponse = await axios.get(`${COINGECKO_API_BASE}/simple/price`, {
      params: {
        ids: 'bitcoin',
        vs_currencies: 'usd',
        include_24hr_change: true,
      },
    });

    const currentPrice = priceResponse.data.bitcoin.usd;
    const change24hPercent = priceResponse.data.bitcoin.usd_24h_change;

    // Get historical chart data
    const chartResponse = await axios.get(`${COINGECKO_API_BASE}/coins/bitcoin/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days === 1 ? 'hourly' : 'daily',
      },
    });

    const chartData: ChartDataPoint[] = chartResponse.data.prices.map((point: [number, number]) => ({
      time: point[0],
      price: point[1],
    }));

    // Calculate 24h change in dollars
    const oldPrice = chartData.length > 0 ? chartData[0].price : currentPrice;
    const change24h = currentPrice - oldPrice;

    return {
      price: currentPrice,
      change24h: change24h,
      changePercent: change24hPercent,
      chartData: chartData,
    };
  } catch (error) {
    console.error('Error fetching BTC chart data from CoinGecko:', error);
    throw error;
  }
}
