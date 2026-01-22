import { NextResponse } from 'next/server';
import { getCryptoNews } from '@/lib/cryptopanic';
import { aggregateAllFeeds } from '@/lib/rss-feeds';
import { Article, NewsResponse } from '@/types';

// Simple in-memory cache
let cachedData: NewsResponse | null = null;
let cacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check if we have valid cached data
    if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // Fetch from all sources in parallel
    const [cryptoPanicArticles, rssArticles] = await Promise.all([
      getCryptoNews({ limit: 20 }),
      aggregateAllFeeds(),
    ]);

    // Combine all articles
    const allArticles = [...cryptoPanicArticles, ...rssArticles];

    // Sort by timestamp (newest first)
    allArticles.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    // Filter articles from the past 24 hours for top headline
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentArticles = allArticles.filter(
      (article) => new Date(article.timestamp).getTime() > twentyFourHoursAgo
    );

    // Select top headline (most recent from past 24h, or first article if none)
    const topHeadline = recentArticles.length > 0 ? recentArticles[0] : allArticles[0] || null;

    // Prepare news feed (exclude top headline from feed)
    const newsFeed = allArticles.filter((article) => article.id !== topHeadline?.id).slice(0, 50);

    const response: NewsResponse = {
      topHeadline,
      newsFeed,
    };

    // Update cache
    cachedData = response;
    cacheTime = Date.now();

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in news API route:', error);

    // Return cached data if available
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    return NextResponse.json(
      { error: 'Failed to fetch news', topHeadline: null, newsFeed: [] },
      { status: 500 }
    );
  }
}
