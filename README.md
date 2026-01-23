# Crypto News Aggregator

A clean, dark-themed cryptocurrency news aggregator built with Next.js 16. Features real-time news from multiple sources and live market data for the top 10 cryptocurrencies.

## 🎯 Features

### News Aggregation
- **Top Headline**: Featured article from the past 24 hours with large display
- **Multi-Source Feed**: Aggregates news from 9 major sources:
  - CoinDesk, Cointelegraph, Decrypt, The Block
  - Bitcoin Magazine, NewsBTC, BeInCrypto, CryptoSlate
  - CryptoPanic (optional, with API key)
- **Load More**: Paginated news feed with "Load More" functionality
- **Direct Links**: Click any article to read on the original source

### Markets Section
- **Top 10 Cryptocurrencies**: Real-time prices by market cap
- **7-Day Sparklines**: Visual price trends for each crypto
- **24h Change**: Color-coded percentage changes (green for gains, red for losses)
- **Auto-Refresh**: Updates every 60 seconds automatically

### Design
- **Dark Mode Only**: Clean, focused dark theme (`#0a0e16` background)
- **Responsive Layout**: News feed (left 2/3) + Markets sidebar (right 1/3)
- **Modern UI**: Subtle borders, hover effects, and smooth transitions
- **Accent Colors**: Green (`#00ffa7`) for gains, Red (`#ff4444`) for losses

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts for sparklines
- **APIs**:
  - CoinGecko API (free tier - crypto prices & market data)
  - CryptoPanic API (optional - additional crypto news)
  - RSS feeds from 8 major outlets (CoinDesk, Cointelegraph, Decrypt, The Block, Bitcoin Magazine, NewsBTC, BeInCrypto, CryptoSlate)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- CryptoPanic API key (optional - app works without it using RSS feeds only)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/onlyshauns/cryptonewsfeed.git
cd crypto-news-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env.local` file:

```env
# Optional: CryptoPanic API Key
# Get yours at https://cryptopanic.com/developers/api/
# App works fine without it using RSS feeds only
CRYPTOPANIC_API_KEY=your_api_key_here

# CoinGecko API URL (free tier, no key required)
NEXT_PUBLIC_COINGECKO_API=https://api.coingecko.com/api/v3
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
crypto-news-aggregator/
├── app/
│   ├── api/
│   │   ├── news/route.ts          # News aggregation endpoint
│   │   └── top-crypto/route.ts    # Top 10 cryptos endpoint
│   ├── components/
│   │   ├── TopHeadline.tsx        # Featured article component
│   │   ├── NewsFeed.tsx           # News list component
│   │   └── TopCryptoCard.tsx      # Markets widget with top 10 cryptos
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main dashboard page
├── lib/
│   ├── coingecko.ts               # CoinGecko API client
│   ├── cryptopanic.ts             # CryptoPanic API client
│   └── rss-feeds.ts               # RSS feed parser
└── types/
    └── index.ts                   # TypeScript type definitions
```

## 🔌 API Routes

### GET `/api/news`
Returns aggregated news from all sources with a featured top headline.

**Response:**
```json
{
  "topHeadline": { "id": "...", "title": "...", "source": "...", ... },
  "newsFeed": [...]
}
```

**Caching:** 5 minutes

### GET `/api/top-crypto`
Returns top 10 cryptocurrencies by market cap with sparklines and 24h change.

**Response:**
```json
{
  "cryptos": [
    { "id": "bitcoin", "symbol": "BTC", "price": 50000, "changePercent": 3.5, "sparkline": [...] },
    ...
  ]
}
```

**Caching:** 30 seconds

## ⚙️ Rate Limits

- **CoinGecko Free Tier**: 10-50 calls/minute
  - Mitigated with 30-second caching on `/api/top-crypto`
- **CryptoPanic Free Tier**: Varies by plan
  - Mitigated with 5-minute caching on `/api/news`
- **RSS Feeds**: No rate limits

## 🌐 Deployment

**Live App:** https://crypto-news-aggregator-nine.vercel.app

Deploy your own instance to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/onlyshauns/cryptonewsfeed)

Remember to add your `CRYPTOPANIC_API_KEY` environment variable in Vercel settings if you want to enable CryptoPanic news (optional).

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.
