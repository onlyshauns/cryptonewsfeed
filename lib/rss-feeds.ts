import Parser from 'rss-parser';
import { Article } from '@/types';

const parser = new Parser();

const RSS_FEEDS = {
  coindesk: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  cointelegraph: 'https://cointelegraph.com/rss',
  decrypt: 'https://decrypt.co/feed',
  theblock: 'https://www.theblock.co/rss.xml',
  bitcoinmagazine: 'https://bitcoinmagazine.com/feed',
  newsbtc: 'https://www.newsbtc.com/feed/',
  beincrypto: 'https://beincrypto.com/feed/',
  cryptoslate: 'https://cryptoslate.com/feed/',
};

/**
 * Parse a single RSS feed and convert to Article format
 */
export async function parseRssFeed(url: string, sourceName: string): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(url);

    const articles: Article[] = feed.items.map((item, index) => ({
      id: `${sourceName}-${item.guid || index}`,
      title: item.title || 'Untitled',
      source: sourceName,
      url: item.link || '#',
      thumbnail: item.enclosure?.url || item['media:thumbnail']?.$ || undefined,
      timestamp: item.pubDate || item.isoDate || new Date().toISOString(),
      description: item.contentSnippet || item.content || undefined,
    }));

    return articles;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${sourceName}:`, error);
    return [];
  }
}

/**
 * Aggregate all RSS feeds
 */
export async function aggregateAllFeeds(): Promise<Article[]> {
  try {
    const [
      coindeskArticles,
      cointelegraphArticles,
      decryptArticles,
      theblockArticles,
      bitcoinmagazineArticles,
      newsbtcArticles,
      beincryptoArticles,
      cryptoslateArticles,
    ] = await Promise.all([
      parseRssFeed(RSS_FEEDS.coindesk, 'CoinDesk'),
      parseRssFeed(RSS_FEEDS.cointelegraph, 'Cointelegraph'),
      parseRssFeed(RSS_FEEDS.decrypt, 'Decrypt'),
      parseRssFeed(RSS_FEEDS.theblock, 'The Block'),
      parseRssFeed(RSS_FEEDS.bitcoinmagazine, 'Bitcoin Magazine'),
      parseRssFeed(RSS_FEEDS.newsbtc, 'NewsBTC'),
      parseRssFeed(RSS_FEEDS.beincrypto, 'BeInCrypto'),
      parseRssFeed(RSS_FEEDS.cryptoslate, 'CryptoSlate'),
    ]);

    return [
      ...coindeskArticles,
      ...cointelegraphArticles,
      ...decryptArticles,
      ...theblockArticles,
      ...bitcoinmagazineArticles,
      ...newsbtcArticles,
      ...beincryptoArticles,
      ...cryptoslateArticles,
    ];
  } catch (error) {
    console.error('Error aggregating RSS feeds:', error);
    return [];
  }
}
