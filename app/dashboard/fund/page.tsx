'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Building2, Wallet, QrCode, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { SuccessCelebration } from '@/components/ui/success-celebration';

const sources = [
  { id: 'bank', label: 'Connected Bank', desc: 'Chase •••• 4532', icon: Building2 },
  { id: 'wallet', label: 'External Wallet', desc: 'Send from any wallet', icon: Wallet },
  { id: 'deposit', label: 'Deposit Address', desc: 'QR code & address', icon: QrCode },
];

type AccountOption = {
  id: string;
  name: string;
};

export default function FundPage() {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('bank');
  const [destination, setDestination] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [destinations, setDestinations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/accounts', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const accountList: AccountOption[] = Array.isArray(data) ? data : [];
        const map: Record<string, string> = {};
        accountList.forEach((a) => { map[a.id] = a.name; });
        setDestinations(map);
        const firstId = accountList[0]?.id;
        if (firstId) setDestination(firstId);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async () => {
    if (!amount) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: destination,
          amount: Number(amount),
          source: sources.find(s => s.id === source)?.label || 'External',
        }),
      });
      if (!res.ok) throw new Error();
      setProcessing(false);
      setSuccess(true);
    } catch {
      setProcessing(false);
      toast.error('Deposit failed. Please try again.');
    }
  };

  const handleReset = () => {
    setAmount('');
    setSource('bank');
    const firstId = Object.keys(destinations)[0];
    if (firstId) setDestination(firstId);
    setProcessing(false);
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Fund Account</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (success) {
    const sourceLabel = sources.find((s) => s.id === source)?.label ?? source;
    return (
      <SuccessCelebration confetti>
        <div className="max-w-lg mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-dim flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green" />
            </div>
            <h2 className="text-2xl font-bold mb-6">Deposit Successful!</h2>
            <div className="w-full bg-bg-card border border-border rounded-lg p-5 mb-6">
              <div className="flex justify-between text-sm py-2">
                <span className="text-text-secondary">Amount</span>
                <span className="font-medium text-green">{formatCurrency(Number(amount))}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-t border-border">
                <span className="text-text-secondary">Source</span>
                <span className="font-medium">{sourceLabel}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-t border-border">
                <span className="text-text-secondary">Destination</span>
                <span className="font-medium">{destinations[destination]}</span>
              </div>
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
                Fund Again
              </button>
            </div>
          </div>
        </div>
      </SuccessCelebration>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Fund Account</h1>
      </div>

      <div className="flex flex-col gap-5">
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 text-center">
          <p className="text-sm text-text-muted mb-2">Amount</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl text-text-muted">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-3xl md:text-[42px] font-bold text-center w-36 md:w-48 outline-none placeholder:text-text-muted"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-text-secondary font-medium mb-2 block">Source</label>
          <div className="flex flex-col gap-2">
            {sources.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-md border transition-all text-left ${
                    source === s.id ? 'border-green bg-green-dim/30' : 'border-border bg-bg-card hover:border-border-hover'
                  }`}
                >
                  <Icon size={18} className={source === s.id ? 'text-green' : 'text-text-muted'} />
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-xs text-text-muted">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-bg-elevated border border-border rounded-md px-4 py-3 text-sm text-text focus:border-green focus:outline-none transition-colors appearance-none"
          >
            {Object.entries(destinations).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        {amount && (
          <div className="bg-bg-elevated rounded-md p-3 flex items-center justify-between text-sm">
            <span className="text-text-muted">Estimated fee</span>
            <span className="text-text">$0.00</span>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!amount || processing}
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
            'Confirm Deposit'
          )}
        </button>
      </div>
    </div>
  );
}
