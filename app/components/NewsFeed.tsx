'use client';

import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useState } from 'react';

interface NewsFeedProps {
  articles: Article[];
}

export default function NewsFeed({ articles }: NewsFeedProps) {
  const [displayCount, setDisplayCount] = useState(10);

  const visibleArticles = articles.slice(0, displayCount);
  const hasMore = displayCount < articles.length;

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 10, articles.length));
  };

  if (articles.length === 0) {
    return (
      <div className="rounded-xl p-6 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
        <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Latest News</h3>
        <div className="text-gray-500 text-center py-12">No news articles available</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Latest News</h3>

      <div className="space-y-4">
        {visibleArticles.map((article) => {
          const timeAgo = formatDistanceToNow(new Date(article.timestamp), { addSuffix: true });

          return (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              {article.thumbnail && (
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded">
                    {article.source}
                  </span>
                  <span>{timeAgo}</span>
                </div>

                {article.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {article.description}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-6 w-full px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-900 dark:text-white font-medium transition-colors border border-gray-200 dark:border-white/10"
        >
          Load More ({articles.length - displayCount} remaining)
        </button>
      )}
    </div>
  );
}
