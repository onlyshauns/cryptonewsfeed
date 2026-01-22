import axios from 'axios';
import { Article } from '@/types';

const CRYPTOPANIC_API_BASE = 'https://cryptopanic.com/api/v1';

interface CryptoPanicOptions {
  currencies?: string[];
  limit?: number;
}

/**
 * Fetch crypto news from CryptoPanic API
 */
export async function getCryptoNews(options: CryptoPanicOptions = {}): Promise<Article[]> {
  const apiKey = process.env.CRYPTOPANIC_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('CryptoPanic API key not configured. Skipping CryptoPanic news.');
    return [];
  }

  try {
    const params: any = {
      auth_token: apiKey,
      public: 'true',
      kind: 'news',
    };

    if (options.currencies && options.currencies.length > 0) {
      params.currencies = options.currencies.join(',');
    }

    const response = await axios.get(`${CRYPTOPANIC_API_BASE}/posts/`, { params });

    const articles: Article[] = response.data.results.slice(0, options.limit || 20).map((post: any) => ({
      id: `cryptopanic-${post.id}`,
      title: post.title,
      source: post.source?.title || 'CryptoPanic',
      url: post.url,
      thumbnail: post.metadata?.image || undefined,
      timestamp: post.published_at,
      description: post.metadata?.description || undefined,
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news from CryptoPanic:', error);
    // Return empty array instead of throwing to allow other sources to work
    return [];
  }
}
