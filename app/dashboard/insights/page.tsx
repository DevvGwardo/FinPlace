'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, ShoppingBag, Coffee, Car, Film, CreditCard, Home } from 'lucide-react';

type Period = 'Week' | 'Month' | 'Quarter';

const dataByPeriod: Record<Period, { name: string; icon: typeof ShoppingBag; amount: number; pct: number; trend: number; color: string }[]> = {
  Week: [
    { name: 'Groceries', icon: ShoppingBag, amount: 108.12, pct: 28, trend: -3, color: 'green' },
    { name: 'Food & Drink', icon: Coffee, amount: 71.83, pct: 18, trend: 8, color: 'blue' },
    { name: 'Transport', icon: Car, amount: 49.50, pct: 13, trend: -1, color: 'purple' },
    { name: 'Entertainment', icon: Film, amount: 39.20, pct: 10, trend: 15, color: 'blue' },
    { name: 'Subscriptions', icon: CreditCard, amount: 22.49, pct: 6, trend: 0, color: 'purple' },
    { name: 'Housing', icon: Home, amount: 96.25, pct: 25, trend: 0, color: 'green' },
  ],
  Month: [
    { name: 'Groceries', icon: ShoppingBag, amount: 432.50, pct: 28, trend: -5, color: 'green' },
    { name: 'Food & Drink', icon: Coffee, amount: 287.30, pct: 18, trend: 12, color: 'blue' },
    { name: 'Transport', icon: Car, amount: 198.00, pct: 13, trend: -2, color: 'purple' },
    { name: 'Entertainment', icon: Film, amount: 156.80, pct: 10, trend: 20, color: 'blue' },
    { name: 'Subscriptions', icon: CreditCard, amount: 89.97, pct: 6, trend: 0, color: 'purple' },
    { name: 'Housing', icon: Home, amount: 385.00, pct: 25, trend: 0, color: 'green' },
  ],
  Quarter: [
    { name: 'Groceries', icon: ShoppingBag, amount: 1297.50, pct: 28, trend: -4, color: 'green' },
    { name: 'Food & Drink', icon: Coffee, amount: 861.90, pct: 18, trend: 10, color: 'blue' },
    { name: 'Transport', icon: Car, amount: 594.00, pct: 13, trend: -3, color: 'purple' },
    { name: 'Entertainment', icon: Film, amount: 470.40, pct: 10, trend: 18, color: 'blue' },
    { name: 'Subscriptions', icon: CreditCard, amount: 269.91, pct: 6, trend: 0, color: 'purple' },
    { name: 'Housing', icon: Home, amount: 1155.00, pct: 25, trend: 0, color: 'green' },
  ],
};

const periodLabels: Record<Period, string> = {
  Week: 'This Week',
  Month: 'This Month',
  Quarter: 'This Quarter',
};

const comparisonText: Record<Period, string> = {
  Week: '2.1% less than last week',
  Month: '3.2% less than last month',
  Quarter: '4.5% less than last quarter',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function InsightsPage() {
  const [period, setPeriod] = useState<Period>('Month');
  const categories = dataByPeriod[period];
  const totalSpent = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Spending Insights</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['Week', 'Month', 'Quarter'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${p === period ? 'bg-green-dim text-green font-medium' : 'bg-bg-elevated text-text-secondary hover:text-text'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 mb-4">
        <p className="text-sm text-text-muted">Total Spent {periodLabels[period]}</p>
        <p className="text-3xl font-bold mt-1">{formatCurrency(totalSpent)}</p>
        <p className="text-sm text-green mt-1 flex items-center gap-1"><TrendingDown size={14} /> {comparisonText[period]}</p>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5 mb-4">
        <h3 className="font-semibold mb-4">By Category</h3>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const bgDim = cat.color === 'green' ? 'bg-green-dim' : cat.color === 'blue' ? 'bg-blue-dim' : 'bg-purple-dim';
            const textColor = cat.color === 'green' ? 'text-green' : cat.color === 'blue' ? 'text-blue' : 'text-purple';
            const barColor = cat.color === 'green' ? 'bg-green' : cat.color === 'blue' ? 'bg-blue' : 'bg-purple';
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-md ${bgDim} ${textColor} flex items-center justify-center`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatCurrency(cat.amount)}</span>
                    <span className="text-xs text-text-muted w-10 text-right">{cat.pct}%</span>
                    {cat.trend !== 0 && (
                      <span className={`text-xs flex items-center gap-0.5 ${cat.trend > 0 ? 'text-red-500' : 'text-green'}`}>
                        {cat.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(cat.trend)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="font-semibold mb-3">AI Insights</h3>
          <div className="flex flex-col gap-2">
            <div className="p-3 bg-blue-dim/30 border border-blue/20 rounded-md">
              <p className="text-sm">Dining spending up <span className="text-blue font-medium">12%</span> from last month. Consider setting a category limit.</p>
            </div>
            <div className="p-3 bg-purple-dim/30 border border-purple/20 rounded-md">
              <p className="text-sm">You have <span className="text-purple font-medium">3 subscriptions</span> totaling $89.97/mo. Review for unused services.</p>
            </div>
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="font-semibold mb-3">Top Merchants</h3>
          <div className="flex flex-col gap-2">
            {[
              { name: 'Whole Foods', amount: 234.50 },
              { name: 'Starbucks', amount: 87.30 },
              { name: 'Uber', amount: 156.00 },
              { name: 'Netflix', amount: 15.99 },
            ].map((m) => (
              <div key={m.name} className="flex items-center justify-between py-1.5">
                <span className="text-sm">{m.name}</span>
                <span className="text-sm font-medium">{formatCurrency(m.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
