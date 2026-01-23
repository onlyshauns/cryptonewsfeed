import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Article } from '@/types';

export async function POST(request: Request) {
  try {
    const { articles } = await request.json() as { articles: Article[] };

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        { error: 'No articles provided' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({ apiKey });

    // Prepare article data for the prompt (limit to top 30 articles to stay within token limits)
    const articlesToAnalyze = articles.slice(0, 30);
    const articleSummaries = articlesToAnalyze
      .map((article, idx) => {
        return `${idx + 1}. [${article.source}] ${article.title}${
          article.description ? `\n   ${article.description.substring(0, 150)}...` : ''
        }`;
      })
      .join('\n\n');

    // Generate summary using Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: `You are a cryptocurrency market analyst. Based on the following recent crypto news articles, write a concise 2-3 paragraph summary of what's currently happening in the crypto market. Focus on major trends, significant price movements, regulatory developments, and overall market sentiment. Be informative but accessible.

Recent Crypto News Articles:

${articleSummaries}

Write a concise market summary (2-3 paragraphs):`,
        },
      ],
    });

    // Extract the text content from the response
    const summary = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Unable to generate summary';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating market summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate market summary' },
      { status: 500 }
    );
  }
}
