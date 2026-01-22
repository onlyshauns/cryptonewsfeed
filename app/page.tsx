'use client';

import { useEffect, useState } from 'react';
import TopHeadline from './components/TopHeadline';
import NewsFeed from './components/NewsFeed';
import BtcPriceCard from './components/BtcPriceCard';
import TopCryptoCard from './components/TopCryptoCard';
import ThemeToggle from './components/ThemeToggle';
import { Article } from '@/types';

export default function Home() {
  const [topHeadline, setTopHeadline] = useState<Article | null>(null);
  const [newsFeed, setNewsFeed] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = async () => {
    try {
      setError(null);
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setTopHeadline(data.topHeadline);
      setNewsFeed(data.newsFeed);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0e16] py-8 px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Crypto News Aggregator
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Real-time news and price feeds
              </p>
            </div>

            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 dark:bg-[#00ffa7] rounded-full animate-pulse" />
                  Updated {formatLastUpdated()}
                </div>
              )}
              <ThemeToggle />
              <button
                onClick={fetchNews}
                disabled={isLoading}
                className="px-5 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-lg transition-colors disabled:opacity-50 text-sm border border-gray-200 dark:border-white/10"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        <main>
          {isLoading && !topHeadline ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-gray-900 dark:text-white text-lg">Loading dashboard...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - News (2/3 width on large screens) */}
              <div className="lg:col-span-2 space-y-8">
                <TopHeadline article={topHeadline} />
                <NewsFeed articles={newsFeed} />
              </div>

              {/* Right Column - Prices (1/3 width on large screens) */}
              <div className="space-y-8">
                <BtcPriceCard />
                <TopCryptoCard />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
