'use client';

import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface TopHeadlineProps {
  article: Article | null;
}

export default function TopHeadline({ article }: TopHeadlineProps) {
  if (!article) {
    return (
      <div className="rounded-xl p-8 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
        <div className="text-gray-500 text-center py-12">No top headline available</div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(article.timestamp), { addSuffix: true });

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl p-8 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all hover:scale-[1.01] cursor-pointer"
    >
      <div className="flex items-start gap-2 mb-4">
        <span className="px-3 py-1 bg-green-50 dark:bg-[#00ffa7]/10 text-green-600 dark:text-[#00ffa7] text-xs font-semibold rounded-full border border-green-200 dark:border-[#00ffa7]/20">
          TOP HEADLINE
        </span>
        <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-xs rounded-full">
          {article.source}
        </span>
      </div>

      {article.thumbnail && (
        <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
        {article.title}
      </h2>

      {article.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {article.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{timeAgo}</span>
        <span>•</span>
        <span className="text-green-600 dark:text-[#00ffa7] font-medium hover:underline">
          Read more →
        </span>
      </div>
    </a>
  );
}
