'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Briefcase, Settings2, Check } from 'lucide-react';

const accountTypes = [
  { id: 'child', label: 'Child', icon: User, desc: 'For kids & teens' },
  { id: 'employee', label: 'Employee', icon: Briefcase, desc: 'For team members' },
  { id: 'custom', label: 'Custom', icon: Settings2, desc: 'Custom purpose' },
];

export default function CreateAccountPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('child');
  const [initialFunding, setInitialFunding] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');
  const [enableDailyLimit, setEnableDailyLimit] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 1500);
  };

  const handleReset = () => {
    setName('');
    setType('child');
    setInitialFunding('');
    setDailyLimit('');
    setEnableDailyLimit(false);
    setProcessing(false);
    setSuccess(false);
  };

  if (success) {
    const typeLabel = accountTypes.find((t) => t.id === type)?.label ?? type;
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-dim flex items-center justify-center mb-5">
            <Check size={32} className="text-green" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
          <div className="bg-bg-card border border-border rounded-lg p-5 w-full mt-4 text-left">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Name</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Type</span>
                <span className="font-medium capitalize">{typeLabel}</span>
              </div>
              {initialFunding && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Initial Funding</span>
                  <span className="font-medium">${parseFloat(initialFunding).toFixed(2)}</span>
                </div>
              )}
              {enableDailyLimit && dailyLimit && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Daily Limit</span>
                  <span className="font-medium">${parseFloat(dailyLimit).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Link
              href="/dashboard/accounts"
              className="bg-green text-black font-semibold px-5 py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
            >
              View Accounts
            </Link>
            <button
              onClick={handleReset}
              className="bg-bg-elevated border border-border px-5 py-2.5 rounded-md text-sm hover:border-border-hover transition-colors"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/accounts" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Create Sub-Account</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Account Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emma's Account"
            className="bg-bg-elevated border border-border rounded-md px-4 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Account Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {accountTypes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-md border transition-all text-center ${
                    type === t.id ? 'border-green bg-green-dim/30' : 'border-border bg-bg-card hover:border-border-hover'
                  }`}
                >
                  <Icon size={18} className={type === t.id ? 'text-green' : 'text-text-muted'} />
                  <span className="text-sm font-medium">{t.label}</span>
                  <span className="text-xs text-text-muted">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Initial Funding (optional)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">$</span>
            <input
              type="number"
              value={initialFunding}
              onChange={(e) => setInitialFunding(e.target.value)}
              placeholder="0.00"
              className="w-full bg-bg-elevated border border-border rounded-md pl-8 pr-4 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold mb-3">Default Controls</h3>
          <div className="flex items-center justify-between p-3 bg-bg-card border border-border rounded-md">
            <span className="text-sm">Daily Spending Limit</span>
            <button
              type="button"
              onClick={() => setEnableDailyLimit(!enableDailyLimit)}
              className={`relative w-11 h-6 rounded-full transition-colors ${enableDailyLimit ? 'bg-green' : 'bg-bg-elevated border border-border'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enableDailyLimit ? 'translate-x-5' : ''}`} />
            </button>
          </div>
          {enableDailyLimit && (
            <div className="mt-2 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">$</span>
              <input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                placeholder="100.00"
                className="w-full bg-bg-elevated border border-border rounded-md pl-8 pr-4 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-green text-black font-semibold py-3 rounded-md hover:opacity-90 transition-opacity mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
}
