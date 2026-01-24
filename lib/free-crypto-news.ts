import axios from 'axios';
import { Article } from '@/types';

const FREE_CRYPTO_NEWS_BASE = 'https://free-crypto-news.vercel.app';

interface FreeCryptoNewsItem {
  id?: string;
  title: string;
  link: string;
  source?: string;
  image?: string;
  published?: string;
  description?: string;
  pubDate?: string;
}

/**
 * Fetch crypto news from free-crypto-news API
 */
export async function getFreeCryptoNews(limit: number = 20): Promise<Article[]> {
  try {
    const response = await axios.get(`${FREE_CRYPTO_NEWS_BASE}/cache/latest.json`, {
      timeout: 10000, // 10 second timeout
    });

    const newsItems: FreeCryptoNewsItem[] = response.data || [];

    const articles: Article[] = newsItems.slice(0, limit).map((item, index) => ({
      id: item.id || `free-crypto-news-${index}`,
      title: item.title || 'Untitled',
      source: item.source || 'Free Crypto News',
      url: item.link || '#',
      thumbnail: item.image || undefined,
      timestamp: item.published || item.pubDate || new Date().toISOString(),
      description: item.description || undefined,
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news from free-crypto-news:', error);
    // Return empty array instead of throwing to allow other sources to work
    return [];
  }
}
