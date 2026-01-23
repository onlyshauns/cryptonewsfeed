import { NextResponse } from 'next/server';
import { Article } from '@/types';
import { analyzeMarketSentiment } from '@/lib/keyword-analyzer';

export async function POST(request: Request) {
  try {
    const { articles } = await request.json() as { articles: Article[] };

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        { error: 'No articles provided' },
        { status: 400 }
      );
    }

    // Analyze articles using keyword-based approach
    const analysis = analyzeMarketSentiment(articles);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error generating market summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate market summary' },
      { status: 500 }
    );
  }
}
