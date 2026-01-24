'use client';

import { useEffect, useState } from 'react';
import TopHeadline from './components/TopHeadline';
import NewsFeed from './components/NewsFeed';
import TopCryptoCard from './components/TopCryptoCard';
import MarketSummaryModal from './components/MarketSummaryModal';
import { Article } from '@/types';

export default function Home() {
  const [topHeadline, setTopHeadline] = useState<Article | null>(null);
  const [newsFeed, setNewsFeed] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const fetchNews = async (isManualRefresh = false) => {
    try {
      setError(null);
      if (isManualRefresh) {
        setIsRefreshing(true);
      }
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setTopHeadline(data.topHeadline);
      setNewsFeed(data.newsFeed);
      setLastUpdated(new Date());
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again.');
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNews();
  }, []);

  // Auto-refresh every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews();
    }, 3 * 60 * 1000); // 3 minutes

    return () => clearInterval(interval);
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

  // Filter news based on selected token
  const filteredNews = selectedToken
    ? newsFeed.filter(article => {
        const searchText = `${article.title} ${article.description || ''}`.toLowerCase();
        return searchText.includes(selectedToken.toLowerCase());
      })
    : newsFeed;

  return (
    <div className="min-h-screen bg-[#0a0e16] py-8 px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Crypto News Aggregator
              </h1>
              <p className="text-gray-400 text-sm">
                Real-time news and price feeds
              </p>
            </div>

            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#00ffa7] rounded-full animate-pulse" />
                  Updated {formatLastUpdated()}
                </div>
              )}
              <button
                onClick={() => setIsSummaryModalOpen(true)}
                disabled={isLoading || newsFeed.length === 0}
                className="px-5 py-2 bg-[#00ffa7]/10 hover:bg-[#00ffa7]/20 text-[#00ffa7] rounded-lg transition-colors disabled:opacity-50 text-sm border border-[#00ffa7]/30 font-medium"
              >
                AI Summary
              </button>
              <button
                onClick={() => fetchNews(true)}
                disabled={isLoading || isRefreshing}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 text-sm border border-white/10"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        <main>
          {isLoading && !topHeadline ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-white text-lg">Loading dashboard...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - News (2/3 width on large screens) */}
              <div className="lg:col-span-2 space-y-8">
                {selectedToken && (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Filtering by:</span>
                      <span className="text-sm font-semibold text-white">{selectedToken}</span>
                      <span className="text-xs text-gray-500">({filteredNews.length} articles)</span>
                    </div>
                    <button
                      onClick={() => setSelectedToken(null)}
                      className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-white rounded transition-colors"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}
                <TopHeadline article={topHeadline} />
                <NewsFeed articles={filteredNews} />
              </div>

              {/* Right Column - Top Cryptos (1/3 width on large screens) */}
              <div className="space-y-8">
                <TopCryptoCard
                  onTokenClick={setSelectedToken}
                  selectedToken={selectedToken}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Market Summary Modal */}
      <MarketSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        articles={newsFeed}
      />

      {/* Refreshing Overlay */}
      {isRefreshing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#0a0e16] border border-white/20 rounded-xl p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-[#00ffa7] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-white font-semibold text-lg">Refreshing Data</p>
                <p className="text-gray-400 text-sm mt-1">Fetching the latest news...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
