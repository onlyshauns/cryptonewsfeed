# Crypto News Aggregator

A modern, real-time cryptocurrency news aggregator built with Next.js 16. Features live BTC price tracking, top 5 cryptocurrencies with sparklines, and aggregated news from multiple sources.

## Features

- **Real-time News Feed**: Aggregates crypto news from CoinDesk, Cointelegraph, and CryptoPanic
- **Top Headline**: Featured article from the past 24 hours
- **Live BTC Price**: Current Bitcoin price with 24-hour chart and change percentage
- **Top 5 Cryptocurrencies**: Real-time prices with 7-day sparklines
- **Auto-refresh**: Prices update automatically every 60 seconds
- **Light/Dark Theme**: Toggle between light and dark modes with persistent preference
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Theme**: next-themes
- **APIs**:
  - CoinGecko API (crypto prices & market data)
  - CryptoPanic API (crypto news)
  - RSS feeds (CoinDesk, Cointelegraph)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- CryptoPanic API key (optional, for CryptoPanic news)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/crypto-news-aggregator.git
cd crypto-news-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env.local` file in the root directory:

```env
# Optional: CryptoPanic API Key
# Get yours at https://cryptopanic.com/developers/api/
CRYPTOPANIC_API_KEY=your_api_key_here

# CoinGecko API URL (free tier, no key required)
NEXT_PUBLIC_COINGECKO_API=https://api.coingecko.com/api/v3
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
crypto-news-aggregator/
├── app/
│   ├── api/
│   │   ├── news/route.ts          # News aggregation endpoint
│   │   ├── prices/route.ts        # BTC price endpoint
│   │   └── top-crypto/route.ts    # Top 5 cryptos endpoint
│   ├── components/
│   │   ├── TopHeadline.tsx        # Featured article component
│   │   ├── NewsFeed.tsx           # News list component
│   │   ├── BtcPriceCard.tsx       # BTC price with chart
│   │   ├── TopCryptoCard.tsx      # Top 5 cryptos with sparklines
│   │   └── ThemeToggle.tsx        # Light/dark theme toggle
│   ├── layout.tsx                 # Root layout with theme provider
│   └── page.tsx                   # Main dashboard page
├── lib/
│   ├── coingecko.ts               # CoinGecko API client
│   ├── cryptopanic.ts             # CryptoPanic API client
│   └── rss-feeds.ts               # RSS feed parser
└── types/
    └── index.ts                   # TypeScript type definitions
```

## API Routes

### GET `/api/news`
Returns aggregated news from all sources with a featured top headline.

### GET `/api/prices`
Returns current BTC price with 24-hour chart data.

### GET `/api/top-crypto`
Returns top 5 cryptocurrencies by market cap with sparklines.

## Rate Limits

- **CoinGecko Free Tier**: 10-50 calls/minute (mitigated with 30-second caching)
- **CryptoPanic Free Tier**: Varies by plan (mitigated with 5-minute caching)
- **RSS Feeds**: No rate limits

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/crypto-news-aggregator)

## License

MIT License - feel free to use this project for personal or commercial purposes.
