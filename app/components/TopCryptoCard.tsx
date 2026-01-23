'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { CryptoPrice } from '@/types';

interface TopCryptoCardProps {
  onTokenClick: (symbol: string) => void;
  selectedToken: string | null;
}

export default function TopCryptoCard({ onTokenClick, selectedToken }: TopCryptoCardProps) {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopCryptos = async () => {
    try {
      setError(null);
      const response = await fetch('/api/top-crypto');
      if (!response.ok) throw new Error('Failed to fetch top cryptos');
      const data = await response.json();
      setCryptos(data.cryptos);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching top cryptos:', err);
      setError('Failed to load top cryptos');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopCryptos();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchTopCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl p-6 bg-white/[0.02] border border-white/10">
        <h3 className="text-lg font-semibold mb-4 text-white">Markets</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="h-12 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || cryptos.length === 0) {
    return (
      <div className="rounded-xl p-6 bg-white/[0.02] border border-white/10">
        <h3 className="text-lg font-semibold mb-4 text-white">Markets</h3>
        <p className="text-red-500 text-sm">{error || 'No data available'}</p>
        <button
          onClick={fetchTopCryptos}
          className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 bg-white/[0.02] border border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-white">Markets</h3>

      <div className="space-y-4">
        {cryptos.map((crypto, index) => {
          const isPositive = crypto.changePercent >= 0;
          const changeColor = isPositive ? '#00ffa7' : '#ff4444';
          const sparklineData = crypto.sparkline
            ? crypto.sparkline.map((price, idx) => ({ value: price, index: idx }))
            : [];
          const isSelected = selectedToken === crypto.symbol;

          return (
            <div
              key={crypto.id}
              onClick={() => onTokenClick(crypto.symbol)}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white/10 border border-white/20'
                  : 'hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">
                    {index + 1}.
                  </span>
                  <span className="font-semibold text-white">
                    {crypto.symbol}
                  </span>
                </div>
                <div className="text-sm text-white">
                  {formatPrice(crypto.price)}
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: changeColor }}
                >
                  {formatChange(crypto.changePercent)}
                </div>
              </div>

              {sparklineData.length > 0 && (
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={changeColor}
                        strokeWidth={1.5}
                        dot={false}
                        animationDuration={300}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
