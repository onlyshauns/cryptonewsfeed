import { Article } from '@/types';

// Sentiment indicators
const BULLISH_WORDS = [
  'surge', 'rally', 'gain', 'rise', 'jump', 'climb', 'soar', 'moon',
  'bullish', 'pump', 'breakthrough', 'adoption', 'milestone', 'record',
  'high', 'profit', 'success', 'positive', 'optimistic', 'growth',
  'upgrade', 'launch', 'partnership', 'invest', 'buy', 'accumulate'
];

const BEARISH_WORDS = [
  'crash', 'drop', 'fall', 'decline', 'plunge', 'dump', 'bearish',
  'collapse', 'risk', 'concern', 'warning', 'fear', 'sell', 'loss',
  'fraud', 'hack', 'exploit', 'scam', 'vulnerable', 'ban', 'regulate',
  'crackdown', 'lawsuit', 'investigation', 'seizure', 'penalty'
];

// Topic categories
const TOPICS = {
  regulation: ['regulation', 'sec', 'regulatory', 'government', 'law', 'legal', 'compliance', 'ban', 'lawsuit'],
  etf: ['etf', 'fund', 'institutional', 'blackrock', 'fidelity', 'grayscale'],
  defi: ['defi', 'decentralized', 'dex', 'uniswap', 'aave', 'compound', 'liquidity'],
  nft: ['nft', 'opensea', 'collectible', 'digital art', 'metaverse'],
  security: ['hack', 'exploit', 'vulnerability', 'breach', 'security', 'attack', 'stolen'],
  adoption: ['adoption', 'mainstream', 'payment', 'merchant', 'integration', 'partnership'],
  mining: ['mining', 'miner', 'hashrate', 'proof-of-work', 'pow'],
  staking: ['staking', 'stake', 'validator', 'proof-of-stake', 'pos'],
  price: ['price', 'value', 'market cap', 'volume', 'trading', 'ath', 'all-time high']
};

// Common crypto symbols and names
const CRYPTO_TOKENS = [
  { symbol: 'BTC', names: ['bitcoin', 'btc'] },
  { symbol: 'ETH', names: ['ethereum', 'eth', 'ether'] },
  { symbol: 'BNB', names: ['binance', 'bnb'] },
  { symbol: 'SOL', names: ['solana', 'sol'] },
  { symbol: 'XRP', names: ['ripple', 'xrp'] },
  { symbol: 'ADA', names: ['cardano', 'ada'] },
  { symbol: 'DOGE', names: ['dogecoin', 'doge'] },
  { symbol: 'AVAX', names: ['avalanche', 'avax'] },
  { symbol: 'MATIC', names: ['polygon', 'matic'] },
  { symbol: 'DOT', names: ['polkadot', 'dot'] },
  { symbol: 'LINK', names: ['chainlink', 'link'] },
  { symbol: 'UNI', names: ['uniswap', 'uni'] },
  { symbol: 'ATOM', names: ['cosmos', 'atom'] },
  { symbol: 'SHIB', names: ['shiba', 'shib'] },
  { symbol: 'LTC', names: ['litecoin', 'ltc'] },
];

export interface MarketSummary {
  sentiment: {
    overall: 'bullish' | 'bearish' | 'neutral';
    bullishCount: number;
    bearishCount: number;
    score: number; // -100 to 100
  };
  topCryptos: Array<{ symbol: string; mentions: number }>;
  topTopics: Array<{ topic: string; count: number }>;
  keyThemes: string[];
  totalArticles: number;
}

export function analyzeMarketSentiment(articles: Article[]): MarketSummary {
  let bullishCount = 0;
  let bearishCount = 0;
  const cryptoMentions: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};

  // Analyze each article
  articles.forEach(article => {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();

    // Count sentiment words
    BULLISH_WORDS.forEach(word => {
      if (text.includes(word)) bullishCount++;
    });

    BEARISH_WORDS.forEach(word => {
      if (text.includes(word)) bearishCount++;
    });

    // Count crypto mentions
    CRYPTO_TOKENS.forEach(token => {
      token.names.forEach(name => {
        if (text.includes(name.toLowerCase())) {
          cryptoMentions[token.symbol] = (cryptoMentions[token.symbol] || 0) + 1;
        }
      });
    });

    // Count topics
    Object.entries(TOPICS).forEach(([topic, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        }
      });
    });
  });

  // Calculate sentiment score (-100 to 100)
  const totalSentiment = bullishCount + bearishCount;
  const sentimentScore = totalSentiment > 0
    ? Math.round(((bullishCount - bearishCount) / totalSentiment) * 100)
    : 0;

  // Determine overall sentiment
  let overall: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (sentimentScore > 15) overall = 'bullish';
  else if (sentimentScore < -15) overall = 'bearish';

  // Sort and get top cryptos
  const topCryptos = Object.entries(cryptoMentions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([symbol, mentions]) => ({ symbol, mentions }));

  // Sort and get top topics
  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  // Generate key themes
  const keyThemes = generateKeyThemes(topTopics, overall, topCryptos);

  return {
    sentiment: {
      overall,
      bullishCount,
      bearishCount,
      score: sentimentScore,
    },
    topCryptos,
    topTopics,
    keyThemes,
    totalArticles: articles.length,
  };
}

function generateKeyThemes(
  topTopics: Array<{ topic: string; count: number }>,
  sentiment: 'bullish' | 'bearish' | 'neutral',
  topCryptos: Array<{ symbol: string; mentions: number }>
): string[] {
  const themes: string[] = [];

  // Overall sentiment theme
  if (sentiment === 'bullish') {
    themes.push('Market showing positive momentum with bullish indicators dominating headlines');
  } else if (sentiment === 'bearish') {
    themes.push('Cautionary sentiment prevails with concerns about market conditions');
  } else {
    themes.push('Mixed signals across the market with balanced bullish and bearish indicators');
  }

  // Top crypto theme
  if (topCryptos.length > 0) {
    const topCrypto = topCryptos[0];
    if (topCrypto.mentions > 5) {
      themes.push(`${topCrypto.symbol} dominates coverage with ${topCrypto.mentions} mentions across recent news`);
    }
  }

  // Topic-based themes
  if (topTopics.length > 0) {
    const primaryTopic = topTopics[0];
    switch (primaryTopic.topic) {
      case 'regulation':
        themes.push('Regulatory developments are a major focus point for the industry');
        break;
      case 'etf':
        themes.push('Institutional investment and ETF discussions gaining traction');
        break;
      case 'security':
        themes.push('Security concerns and vulnerabilities highlighted in recent coverage');
        break;
      case 'adoption':
        themes.push('Growing mainstream adoption and integration efforts underway');
        break;
      case 'defi':
        themes.push('DeFi ecosystem seeing significant activity and development');
        break;
      case 'price':
        themes.push('Price movements and trading activity capturing major attention');
        break;
    }
  }

  return themes;
}
