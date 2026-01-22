import Parser from 'rss-parser';
import { Article } from '@/types';

const parser = new Parser();

const RSS_FEEDS = {
  coindesk: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  cointelegraph: 'https://cointelegraph.com/rss',
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
    const [coindeskArticles, cointelegraphArticles] = await Promise.all([
      parseRssFeed(RSS_FEEDS.coindesk, 'CoinDesk'),
      parseRssFeed(RSS_FEEDS.cointelegraph, 'Cointelegraph'),
    ]);

    return [...coindeskArticles, ...cointelegraphArticles];
  } catch (error) {
    console.error('Error aggregating RSS feeds:', error);
    return [];
  }
}
