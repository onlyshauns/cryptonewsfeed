'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { BtcPriceData } from '@/types';

export default function BtcPriceCard() {
  const [btcData, setBtcData] = useState<BtcPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

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
      <div className="rounded-xl p-6 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">BTC Live Price</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !btcData) {
    return (
      <div className="rounded-xl p-6 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">BTC Live Price</h3>
        <p className="text-red-500 text-sm">{error || 'No data available'}</p>
        <button
          onClick={fetchBtcPrice}
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-sm text-gray-900 dark:text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const isPositive = btcData.changePercent >= 0;
  const isDark = theme === 'dark';
  const changeColor = isDark
    ? (isPositive ? '#00ffa7' : '#ff4444')
    : (isPositive ? '#10b981' : '#ef4444');

  return (
    <div className="rounded-xl p-6 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">BTC Live Price</h3>
        <span className="inline-block w-2 h-2 bg-green-500 dark:bg-[#00ffa7] rounded-full animate-pulse" />
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {formatPrice(btcData.price)}
        </div>
        <div
          className="text-lg font-semibold"
          style={{ color: changeColor }}
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
              stroke={changeColor}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-500">
        Last 24 hours
      </div>
    </div>
  );
}
