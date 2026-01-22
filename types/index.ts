// Core data types for the crypto news aggregator

export interface Article {
  id: string;
  title: string;
  source: string;
  url: string;
  thumbnail?: string;
  timestamp: string;
  description?: string;
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  sparkline?: number[];
}

export interface BtcPriceData {
  price: number;
  change24h: number;
  changePercent: number;
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  time: number;
  price: number;
}

export interface NewsResponse {
  topHeadline: Article | null;
  newsFeed: Article[];
}

export interface TopCryptoResponse {
  cryptos: CryptoPrice[];
}
