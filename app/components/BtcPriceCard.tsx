'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { BtcPriceData } from '@/types';

export default function BtcPriceCard() {
  const [btcData, setBtcData] = useState<BtcPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBtcPrice = async () => {
    try {
      setError(null);
      const response = await fetch('/api/prices');
      if (!response.ok) throw new Error('Failed to fetch BTC price');
      const data = await response.json();
      setBtcData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching BTC price:', err);
      setError('Failed to load BTC price');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBtcPrice();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchBtcPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl p-6 bg-white/[0.02] dark:bg-white/[0.02] bg-white border border-white/10 dark:border-white/10 border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-white dark:text-white text-gray-900">BTC Live Price</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !btcData) {
    return (
      <div className="rounded-xl p-6 bg-white/[0.02] dark:bg-white/[0.02] bg-white border border-white/10 dark:border-white/10 border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-white dark:text-white text-gray-900">BTC Live Price</h3>
        <p className="text-red-500 text-sm">{error || 'No data available'}</p>
        <button
          onClick={fetchBtcPrice}
          className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const isPositive = btcData.changePercent >= 0;
  const changeColor = isPositive ? '#00ffa7' : '#ff4444';
  const changeColorLight = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="rounded-xl p-6 bg-white/[0.02] dark:bg-white/[0.02] bg-white border border-white/10 dark:border-white/10 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white dark:text-white text-gray-900">BTC Live Price</h3>
        <span className="inline-block w-2 h-2 bg-[#00ffa7] dark:bg-[#00ffa7] bg-green-500 rounded-full animate-pulse" />
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-white dark:text-white text-gray-900 mb-2">
          {formatPrice(btcData.price)}
        </div>
        <div
          className="text-lg font-semibold"
          style={{ color: window.matchMedia('(prefers-color-scheme: dark)').matches ? changeColor : changeColorLight }}
        >
          {formatChange(btcData.changePercent)}
        </div>
      </div>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={btcData.chartData}>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Line
              type="monotone"
              dataKey="price"
              stroke={window.matchMedia('(prefers-color-scheme: dark)').matches ? changeColor : changeColorLight}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-500 text-gray-600">
        Last 24 hours
      </div>
    </div>
  );
}
