'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/types';

interface MarketSummary {
  sentiment: {
    overall: 'bullish' | 'bearish' | 'neutral';
    bullishCount: number;
    bearishCount: number;
    score: number;
  };
  topCryptos: Array<{ symbol: string; mentions: number }>;
  topTopics: Array<{ topic: string; count: number }>;
  keyThemes: string[];
  totalArticles: number;
}

interface MarketSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

export default function MarketSummaryModal({ isOpen, onClose, articles }: MarketSummaryModalProps) {
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !summary && articles.length > 0) {
      generateSummary();
    }
  }, [isOpen]);

  const generateSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/market-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles }),
      });

      if (!response.ok) throw new Error('Failed to generate summary');

      const data = await response.json();
      setSummary(data.analysis);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate market summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation completes
    setTimeout(() => {
      setSummary(null);
      setError(null);
    }, 300);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return '#00ffa7';
      case 'bearish':
        return '#ff4444';
      default:
        return '#ffeb3b';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return '📈';
      case 'bearish':
        return '📉';
      default:
        return '😐';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-3xl mx-4 bg-[#0a0e16] border border-white/20 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 sticky top-0 bg-[#0a0e16] z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Market Analysis</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Keyword-based analysis of {articles.length} articles
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-[#00ffa7] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm">Analyzing market trends...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={generateSummary}
                className="mt-3 px-4 py-2 bg-red-900/30 hover:bg-red-900/40 text-red-400 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {summary && !isLoading && (
            <div className="space-y-3">
              {/* Sentiment Overview */}
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                <h3 className="text-base font-semibold text-white mb-2">Market Sentiment</h3>
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className="text-4xl"
                    style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}
                  >
                    {getSentimentEmoji(summary.sentiment.overall)}
                  </div>
                  <div className="flex-1">
                    <div
                      className="inline-block px-3 py-1.5 rounded-lg font-bold text-base uppercase"
                      style={{
                        backgroundColor: `${getSentimentColor(summary.sentiment.overall)}20`,
                        color: getSentimentColor(summary.sentiment.overall),
                        border: `1px solid ${getSentimentColor(summary.sentiment.overall)}40`,
                      }}
                    >
                      {summary.sentiment.overall}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="text-[#00ffa7]">
                        ↑ {summary.sentiment.bullishCount} positive signals
                      </span>
                      <span className="text-[#ff4444]">
                        ↓ {summary.sentiment.bearishCount} negative signals
                      </span>
                    </div>
                  </div>
                </div>
                {/* Sentiment Bar */}
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${((summary.sentiment.bullishCount / (summary.sentiment.bullishCount + summary.sentiment.bearishCount)) * 100) || 50}%`,
                      backgroundColor: '#00ffa7',
                    }}
                  />
                </div>
              </div>

              {/* Key Themes */}
              <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                <h3 className="text-base font-semibold text-white mb-2">Key Themes</h3>
                <ul className="space-y-1">
                  {summary.keyThemes.map((theme, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#00ffa7] text-sm">•</span>
                      <span className="text-gray-300 text-sm leading-snug">{theme}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Top Cryptocurrencies */}
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-white mb-2">Most Mentioned</h3>
                  <div className="space-y-2">
                    {summary.topCryptos.length > 0 ? (
                      summary.topCryptos.map((crypto, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="font-semibold text-white text-sm">{crypto.symbol}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#00ffa7]"
                                style={{
                                  width: `${(crypto.mentions / summary.topCryptos[0].mentions) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-8 text-right">
                              {crypto.mentions}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No specific tokens identified</p>
                    )}
                  </div>
                </div>

                {/* Top Topics */}
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-white mb-2">Hot Topics</h3>
                  <div className="space-y-2">
                    {summary.topTopics.length > 0 ? (
                      summary.topTopics.map((topic, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="font-medium text-white capitalize text-sm">{topic.topic}</span>
                          <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-300">
                            {topic.count} mentions
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No topics identified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {summary && !isLoading && (
          <div className="p-4 border-t border-white/5 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Powered by keyword analysis • No API required
            </p>
            <button
              onClick={generateSummary}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors border border-white/10"
            >
              Refresh Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
