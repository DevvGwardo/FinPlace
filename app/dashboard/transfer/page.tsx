'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowDown, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function TransferPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((a: any) => ({
          id: a.id,
          label: a.name,
          balance: formatCurrency(Number(a.balance)),
        }));
        setAccounts(mapped);
        if (mapped.length > 0) setFrom(mapped[0].id);
        if (mapped.length > 1) setTo(mapped[1].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async () => {
    if (!amount || from === to) return;
    setProcessing(true);
    setError('');
    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccountId: from, toAccountId: to, amount: Number(amount), note }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Transfer failed');
        setProcessing(false);
        return;
      }
      setProcessing(false);
      setSuccess(true);
    } catch {
      setError('Transfer failed');
      setProcessing(false);
    }
  };

  const handleReset = () => {
    if (accounts.length > 0) setFrom(accounts[0].id);
    if (accounts.length > 1) setTo(accounts[1].id);
    setAmount('');
    setNote('');
    setError('');
    setProcessing(false);
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Transfer</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!loading && accounts.length < 2) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Transfer</h1>
        </div>
        <div className="text-center py-12 text-text-muted">
          <p className="text-sm">Create at least 2 accounts to transfer between them.</p>
          <Link href="/dashboard/accounts/new" className="text-green text-sm hover:underline mt-2 inline-block">Create an account</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-dim flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green" />
          </div>
          <h2 className="text-2xl font-bold mb-6">Transfer Complete!</h2>
          <div className="w-full bg-bg-card border border-border rounded-lg p-5 mb-6">
            <div className="flex justify-between text-sm py-2">
              <span className="text-text-secondary">From</span>
              <span className="font-medium">{accounts.find((a) => a.id === from)?.label}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-t border-border">
              <span className="text-text-secondary">To</span>
              <span className="font-medium">{accounts.find((a) => a.id === to)?.label}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-t border-border">
              <span className="text-text-secondary">Amount</span>
              <span className="font-medium text-green">${Number(amount).toFixed(2)}</span>
            </div>
            {note && (
              <div className="flex justify-between text-sm py-2 border-t border-border">
                <span className="text-text-secondary">Note</span>
                <span className="font-medium">{note}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3 w-full">
            <Link
              href="/dashboard"
              className="flex-1 text-center bg-bg-elevated border border-border text-text font-semibold py-3 rounded-md text-sm hover:border-border-hover transition-colors"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleReset}
              className="flex-1 bg-green text-black font-semibold py-3 rounded-md text-sm hover:opacity-90 transition-opacity"
            >
              Make Another Transfer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Transfer</h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-bg-elevated border border-border rounded-md px-4 py-3 text-sm text-text focus:border-green focus:outline-none transition-colors appearance-none"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.label} ({a.balance})</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center">
            <ArrowDown size={16} className="text-text-muted" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-bg-elevated border border-border rounded-md px-4 py-3 text-sm text-text focus:border-green focus:outline-none transition-colors appearance-none"
          >
            {accounts.filter((a) => a.id !== from).map((a) => (
              <option key={a.id} value={a.id}>{a.label} ({a.balance})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Amount</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-bg-elevated border border-border rounded-md pl-8 pr-4 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a memo..."
            className="bg-bg-elevated border border-border rounded-md px-4 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
          />
        </div>

        {amount && (
          <div className="bg-bg-card border border-border rounded-md p-4">
            <p className="text-xs text-text-muted mb-2">Review</p>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">From</span>
              <span>{accounts.find((a) => a.id === from)?.label}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-text-secondary">To</span>
              <span>{accounts.find((a) => a.id === to)?.label}</span>
            </div>
            <div className="flex justify-between text-sm mt-1 font-medium">
              <span className="text-text-secondary">Amount</span>
              <span>${Number(amount).toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!amount || from === to || processing}
          className="w-full bg-green text-black font-semibold py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            'Confirm Transfer'
          )}
        </button>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}
