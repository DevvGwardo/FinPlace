'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const categories = ['Gambling', 'Alcohol', 'Tobacco', 'Adult Content', 'Cryptocurrency', 'Travel'];

export default function AccountControlsPage() {
  const [dailyLimit, setDailyLimit] = useState('50');
  const [weeklyLimit, setWeeklyLimit] = useState('200');
  const [monthlyLimit, setMonthlyLimit] = useState('500');
  const [allowTransfers, setAllowTransfers] = useState(true);
  const [allowExternal, setAllowExternal] = useState(false);
  const [blockedCategories, setBlockedCategories] = useState<string[]>(['Gambling', 'Alcohol']);
  const [frozen, setFrozen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleCategory = (cat: string) => {
    setBlockedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast('Controls saved successfully');
    }, 1000);
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/accounts/1" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Account Controls</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Spending Limits */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="font-semibold mb-4">Spending Limits</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Daily Limit', value: dailyLimit, set: setDailyLimit },
              { label: 'Weekly Limit', value: weeklyLimit, set: setWeeklyLimit },
              { label: 'Monthly Limit', value: monthlyLimit, set: setMonthlyLimit },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <label className="text-sm text-text-secondary">{item.label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => item.set(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-md pl-8 pr-4 py-2.5 text-sm text-text focus:border-green focus:outline-none transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="font-semibold mb-4">Permissions</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Allow internal transfers', checked: allowTransfers, set: setAllowTransfers },
              { label: 'Allow external sends', checked: allowExternal, set: setAllowExternal },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <span className="text-sm">{item.label}</span>
                <button
                  type="button"
                  onClick={() => item.set(!item.checked)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${item.checked ? 'bg-green' : 'bg-bg-elevated border border-border'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${item.checked ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Merchant Restrictions */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="font-semibold mb-4">Blocked Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-2 rounded-md text-sm border transition-all ${
                  blockedCategories.includes(cat)
                    ? 'border-red-500/30 bg-red-500/10 text-red-500'
                    : 'border-border bg-bg-elevated text-text-secondary hover:border-border-hover'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Freeze Account */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Freeze Account</h3>
              <p className="text-xs text-text-muted mt-1">Temporarily disable all transactions</p>
            </div>
            <button
              type="button"
              onClick={() => setFrozen(!frozen)}
              className={`relative w-11 h-6 rounded-full transition-colors ${frozen ? 'bg-blue' : 'bg-bg-elevated border border-border'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${frozen ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-green text-black font-semibold py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green text-black text-sm font-medium px-5 py-2.5 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
