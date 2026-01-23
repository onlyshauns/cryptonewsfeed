'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/types';

interface MarketSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

export default function MarketSummaryModal({ isOpen, onClose, articles }: MarketSummaryModalProps) {
  const [summary, setSummary] = useState<string>('');
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
      setSummary(data.summary);
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
      setSummary('');
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl mx-4 bg-[#0a0e16] border border-white/20 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Market Summary</h2>
            <p className="text-sm text-gray-400 mt-1">
              AI-generated overview based on {articles.length} articles
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
        <div className="p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-[#00ffa7] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm">Analyzing market news...</p>
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
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {summary}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {summary && !isLoading && (
          <div className="p-6 border-t border-white/10 flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Powered by Claude AI
            </p>
            <button
              onClick={generateSummary}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors border border-white/10"
            >
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
